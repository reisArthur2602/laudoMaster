from flask import Flask, send_file, jsonify, request, render_template
import requests
import io
import pydicom
from pydicom.pixel_data_handlers.util import apply_voi_lut
import numpy as np
from PIL import Image
import traceback

app = Flask(__name__, static_folder="static", template_folder="static")

ORTHANC_URL = "http://8aff0850b047.sn.mynetname.net:1111"
ORTHANC_USER = "admin"
ORTHANC_PASS = "Master@2024"

def get_dicom_instance(instance_id):
    url = f"{ORTHANC_URL}/instances/{instance_id}/file"
    r = requests.get(url, auth=(ORTHANC_USER, ORTHANC_PASS), timeout=10)
    r.raise_for_status()
    return io.BytesIO(r.content)


@app.route("/api/png/<instance_id>")
def view_as_png(instance_id):
    try:
        print(f"[INFO] Solicitando DICOM: {instance_id}")
        file_stream = get_dicom_instance(instance_id)
        ds = pydicom.dcmread(file_stream, force=True)

        arr = apply_voi_lut(ds.pixel_array, ds)
        if ds.PhotometricInterpretation == "MONOCHROME1":
            arr = np.amax(arr) - arr

        arr = arr - np.min(arr)
        arr = arr / np.max(arr)
        arr = (arr * 255).astype(np.uint8)

        img = Image.fromarray(arr).convert("L")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)

        return send_file(buf, mimetype="image/png")

    except Exception as e:
        print("[ERRO PNG]")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/study/<study_id>")
def get_study(study_id):
    try:
        print(f"[INFO] Buscando estudo: {ORTHANC_URL}/studies/{study_id}")
        r = requests.get(
            f"{ORTHANC_URL}/studies/{study_id}", auth=(ORTHANC_USER, ORTHANC_PASS)
        )
        if r.status_code != 200:
            return jsonify({"error": "Estudo não encontrado"}), 404
        data = r.json()

        # Monta resposta simplificada para o viewer
        study = {
            "id": data["ID"],
            "desc": data["MainDicomTags"].get("StudyDescription", ""),
            "date": data["MainDicomTags"].get("StudyDate", ""),
            "patient": data.get("PatientMainDicomTags", {}),
            "instances": [],
        }

        # Busca todas as séries
        for series_id in data.get("Series", []):
            sr = requests.get(
                f"{ORTHANC_URL}/series/{series_id}", auth=(ORTHANC_USER, ORTHANC_PASS)
            )
            if sr.status_code == 200:
                js = sr.json()
                for inst in js.get("Instances", []):
                    study["instances"].append(inst)

        return jsonify(study)

    except Exception as e:
        print("[ERRO GET STUDY]")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/")
def index():
    return "<h2>Servidor DICOM Viewer ativo!</h2>"


@app.route("/viewer_pro.html")
def viewer_page():
    return app.send_static_file("viewer_pro.html")


if __name__ == "__main__":
    print("🚀 Flask rodando em http://0.0.0.0:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=True)

import { api } from "@/lib/axios";


type AttachStudyFileParams = {
  studyId: string;
  file: File;
};

export async function attachStudyFile({
  studyId,
  file,
}: AttachStudyFileParams) {
  const formData = new FormData();
  formData.append("file", file);

  await api.post(`/studies/${studyId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

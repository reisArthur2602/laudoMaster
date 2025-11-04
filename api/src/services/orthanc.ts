import dayjs from "dayjs";
import axios from "axios";

const ORTHANC_URL =
  process.env.ORTHANC_URL || "http://8aff0850b047.sn.mynetname.net:1111";
const ORTHANC_USER = process.env.ORTHANC_USER || "admin";
const ORTHANC_PASS = process.env.ORTHANC_PASS || "Master@2024";

export const api = axios.create({
  baseURL: ORTHANC_URL,
  auth: {
    username: ORTHANC_USER,
    password: ORTHANC_PASS,
  },
  timeout: 10_000,
});

export type OrthancStudy = {
  ID: string;
  IsStable: boolean;
  Labels: string[];
  LastUpdate: string;
  MainDicomTags: {
    AccessionNumber?: string;
    InstitutionName?: string;
    ReferringPhysicianName?: string;
    StudyDate?: string;
    StudyID?: string;
    StudyInstanceUID?: string;
    StudyTime?: string;
    StudyDescription?: string;
    Modality?: string;
  };
  ParentPatient: string;
  PatientMainDicomTags: {
    PatientBirthDate?: string;
    PatientID?: string;
    PatientName?: string;
    PatientSex?: string;
  };
  Series: string[];
  Type: "Study";
};

export type OrthancSeries = {
  ExpectedNumberOfInstances: number | null;
  ID: string;
  Instances: string[];
  IsStable: boolean;
  Labels: string[];
  LastUpdate: string;
  MainDicomTags: {
    Manufacturer?: string;
    Modality?: string;
    OperatorsName?: string;
    SeriesDate?: string;
    SeriesInstanceUID?: string;
    SeriesNumber?: string;
    SeriesTime?: string;
    StationName?: string;
  };
  ParentStudy: string;
  Status: string;
  Type: "Series";
};

export type OrthancInstance = {
  id: string;
  previewURL: string;
  dicomURL: string;
};

export async function getStudiesCurrentDate(): Promise<string[]> {
  const studyDate = dayjs().format("YYYYMMDD");

  const { data } = await api.post("/tools/find", {
    Level: "Study",
    Query: { StudyDate: `20251024` },
  });

  return data;
}

export async function getStudyDetails(studyID: string) {
  const { data } = await api.get<OrthancStudy>(`/studies/${studyID}`);
  return data;
}

export async function getSeriesDetails(seriesID: string) {
  const { data } = await api.get<OrthancSeries>(`/series/${seriesID}`);
  return data;
}

type Instance = {
  FileSize: number;
  FileUuid: string;
  ID: string;
  IndexInSeries: number;
  Labels: string[];
  MainDicomTags: {
    InstanceNumber?: string;
    SOPInstanceUID?: string;
  };
  ParentSeries: string;
  Type: "Instance";
};

export async function getInstances(
  studyID: string
): Promise<OrthancInstance[]> {
  const { data } = await api.get<Instance[]>(`/studies/${studyID}/instances`);

  return data.map((instance) => ({
    id: instance.ID,
    previewURL: `${ORTHANC_URL}/instances/${instance.ID}/preview`,
    dicomURL: `${ORTHANC_URL}/instances/${instance.ID}/file`,
  }));
}

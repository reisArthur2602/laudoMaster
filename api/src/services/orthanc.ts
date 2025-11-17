import axios from "axios";
import dayjs from "dayjs";

const ORTHANC_URL = process.env.ORTHANC_URL!;
const ORTHANC_USER = process.env.ORTHANC_USER!;
const ORTHANC_PASS = process.env.ORTHANC_PASS!;

export const api = axios.create({
  baseURL: ORTHANC_URL,
  auth: {
    username: ORTHANC_USER,
    password: ORTHANC_PASS,
  },
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
    Query: { StudyDate: studyDate },
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

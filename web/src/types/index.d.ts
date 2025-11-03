type Roles = "SUPER_ADMIN" | "MEMBER";

type Invite = {
  id: string;
  organization: {
    id: string;
    name: string;
  };
  role: Roles;
  expireAt: string;
};

type Member = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: Roles;
  createdAt: string;
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  role: Roles;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};
type Equipment = {
  id: string;
  name?: string;
  modality?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
  createdAt: string;
};

type Patient = {
  id: string;
  name: string;
  cpf: string;
  phone: string | null;
  gender: string | null;
  birthDate: string | null;
  createdAt: string;
  studies: {
    id: string;
    modality: string | null;
    description: string | null;
    status: string;
    createdAt: string;
  }[];
};

type StudyStatus = "PENDING" | "REPORTING" | "REPORTED" | "DELIVERED";

type Study = {
  id: string;
  modality: string | null;
  status: StudyStatus;
  description: string | null;
  createdAt: string;
  attachments?: {
    id: string;
    filename: string;
    url: string;
    size: number;
  }[];
  patient?: {
    id: string;
    name: string;
    cpf: string;
    phone: string | null;
  };
  instances?: {
    id: string;
    dicomUid: string | null;
    previewUrl: string | null;
    dicomUrl: string | null;
  }[];
};

type OrganizationOverview = {
  stats: {
    totalPatients: number;
    totalStudies: number;
    pendingStudies: number;
    deliveredStudies: number;
  };
  studiesByModality: {
    modality: string | null;
    count: number;
  }[];
  studiesByStatus: {
    status: StudyStatus;
    count: number;
  }[];
  studiesPerDay: {
    date: string;
    count: number;
  }[];
};

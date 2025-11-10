import { api } from "@/lib/axios";

type Request = {
  slug: string;
  patientId: string;
  description: string;

  file: File;
};

export const createStudy = async ({ slug, ...data }: Request) => {
  const formData = new FormData();

  formData.append("patientId", data.patientId);
  formData.append("description", data.description);

  formData.append("file", data.file);

  await api.post(`/org/${slug}/studies`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: [(data) => data],
  });
};

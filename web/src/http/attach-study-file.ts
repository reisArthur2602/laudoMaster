import { api } from "@/lib/axios";

type AttachStudyFileParams = {
  studyId: string;
  file: File;
  slug: string;
};

export async function attachStudyFile({
  studyId,
  file,
  slug,
}: AttachStudyFileParams) {
  const formData = new FormData();
  formData.append("file", file);

  await api.post(`/org/${slug}/studies/${studyId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

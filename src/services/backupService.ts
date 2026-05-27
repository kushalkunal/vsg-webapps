import api, { tenantPath } from "./api";

export interface RestoreResult {
  students: number;
  colleges: number;
  courses: number;
  fees: number;
  errors: string[];
}

export const backupService = {
  /**
   * Download a full Excel backup of all tenant data.
   * Returns a Blob so the caller can trigger a file download.
   */
  download: () =>
    api
      .get<Blob>(tenantPath("/backup/download"), { responseType: "blob" })
      .then((r) => r.data),

  /**
   * Upload an Excel backup file to restore data.
   */
  restore: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api
      .post<RestoreResult>(tenantPath("/backup/restore"), form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};

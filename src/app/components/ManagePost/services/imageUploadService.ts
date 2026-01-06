import axios from "axios";

export class ImageUploadService {
  static async uploadImages(
    files: File[],
    userName: string
  ): Promise<string[] | null> {
    try {
      const form = new FormData();
      for (const file of files) {
        form.append("file", file);
      }

      const response = await axios.post(
        `/api/UploadImage?name=${encodeURIComponent(userName)}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "*/*",
          },
        }
      );

      const raw = (response.data?.data ?? null) as string | string[] | null;
      if (!raw) return null;

      return Array.isArray(raw) ? raw : [raw];
    } catch (err: unknown) {
      console.error("Image upload failed:", err);
      throw new Error("Failed to upload images. Please try again.");
    }
  }
}

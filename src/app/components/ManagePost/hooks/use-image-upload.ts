import { useState, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import { buildProfileUrl, FILE_ENDPOINTS, httpClient } from "@/lib";

interface UseImageUploadProps {
  userName?: string;
  apiEndpoint?: string;
}

interface UploadResponse {
  data?: string | string[];
  imageUrls?: string[];
  urls?: string[];
  [key: string]: any;
}

export const useImageUpload = ({
  userName = "user",
  apiEndpoint,
}: UseImageUploadProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadImages = useCallback(
    async (files: File[]): Promise<string[] | null> => {
      if (files.length === 0) return null;

      setIsUploading(true);
      setUploadError("");
      setUploadProgress(0);

      try {
        const formData = new FormData();

        // Append all files
        files.forEach((file) => {
          formData.append("file", file);
        });

        // Build API URL
        const apiUrl = apiEndpoint || buildProfileUrl(FILE_ENDPOINTS.upload);

        // Make upload request
        const response: AxiosResponse<UploadResponse> = await httpClient.post(
          apiUrl,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentCompleted);
              }
            },
          }
        );

        // Extract image URLs from response
        const rawData = response.data;

        if (!rawData) {
          throw new Error("No data returned from upload");
        }

        // Handle different response formats
        let imageUrls: string[] = [];

        if (Array.isArray(rawData)) {
          // Direct array of URLs
          imageUrls = rawData;
        } else if (typeof rawData === "string") {
          // Single URL string
          imageUrls = [rawData];
        } else if (rawData.data) {
          // Nested in data property
          imageUrls = Array.isArray(rawData.data)
            ? rawData.data
            : [rawData.data];
        } else if (rawData.imageUrls) {
          // In imageUrls property
          imageUrls = rawData.imageUrls;
        } else if (rawData.urls) {
          // In urls property
          imageUrls = rawData.urls;
        }

        // Filter out any invalid URLs
        imageUrls = imageUrls.filter(
          (url) => typeof url === "string" && url.length > 0
        );

        if (imageUrls.length === 0) {
          throw new Error("No valid image URLs returned from upload");
        }

        setUploadProgress(100);
        return imageUrls;
      } catch (error) {
        console.error("Image upload error:", error);

        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : error instanceof Error
          ? error.message
          : "Failed to upload images";

        setUploadError(errorMessage);
        return null;
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [apiEndpoint]
  );

  const resetUploadState = useCallback(() => {
    setUploadError("");
    setUploadProgress(0);
  }, []);

  return {
    uploadImages,
    isUploading,
    uploadError,
    uploadProgress,
    resetUploadState,
  };
};

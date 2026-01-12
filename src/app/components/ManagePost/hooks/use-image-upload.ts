import { useState, useCallback, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { buildProfileUrl, FILE_ENDPOINTS, httpClient } from "@/lib";

interface UseImageUploadProps {
  userName?: string;
  apiEndpoint?: string;
  onUpdateImage: (image: string | string[]) => void;
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
  onUpdateImage,
}: UseImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Critical: Use ref to prevent duplicate uploads
  const uploadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadImages = useCallback(
    async (files: File[]): Promise<string[] | null> => {
      if (files.length === 0) return null;

      // CRITICAL: Block duplicate uploads using ref
      if (uploadingRef.current) {
        console.log("Upload already in progress, blocking duplicate request");
        return null;
      }

      // Set uploading flags immediately
      uploadingRef.current = true;
      setIsUploading(true);
      setUploadError("");
      setUploadProgress(0);

      // Create new abort controller for this upload
      abortControllerRef.current = new AbortController();

      try {
        const formData = new FormData();

        // Append all files
        files.forEach((file) => {
          formData.append("file", file);
        });

        // Build API URL
        const apiUrl = buildProfileUrl(FILE_ENDPOINTS.upload);

        console.log(`Starting upload of ${files.length} file(s)...`);

        // Make upload request
        const response: AxiosResponse<UploadResponse> = await httpClient.post(
          apiUrl,
          formData,
          {
            signal: abortControllerRef.current.signal,
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
            },
            timeout: 120000, // 2 minutes timeout for large files
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
        onUpdateImage(rawData as string | string[])

        if (!rawData) {
          throw new Error("No data returned from upload");
        }

        // Handle different response formats
        let imageUrls: string[] = [];

        if (Array.isArray(rawData)) {
          imageUrls = rawData;
        } else if (typeof rawData === "string") {
          imageUrls = [rawData];
        } else if (rawData.data) {
          imageUrls = Array.isArray(rawData.data)
            ? rawData.data
            : [rawData.data];
        } else if (rawData.imageUrls) {
          imageUrls = rawData.imageUrls;
        } else if (rawData.urls) {
          imageUrls = rawData.urls;
        }

        // Filter out any invalid URLs
        imageUrls = imageUrls.filter(
          (url) => typeof url === "string" && url.length > 0
        );

        if (imageUrls.length === 0) {
          throw new Error("No valid image URLs returned from upload");
        }

        console.log(`Upload successful: ${imageUrls.length} image(s) uploaded`);
        setUploadProgress(100);
        return imageUrls;
      } catch (error) {
        // Check if it was intentionally cancelled
        if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
          console.log("Upload was cancelled");
          return null;
        }

        console.error("Image upload error:", error);

        // Detailed error logging
        if (axios.isAxiosError(error)) {
          console.error("Error details:", {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
          });
        }

        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : error instanceof Error
          ? error.message
          : "Failed to upload images";

        setUploadError(errorMessage);
        return null;
      } finally {
        // Reset flags
        uploadingRef.current = false;
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
        abortControllerRef.current = null;
      }
    },
    [apiEndpoint]
  );

  const resetUploadState = useCallback(() => {
    setUploadError("");
    setUploadProgress(0);
  }, []);

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      uploadingRef.current = false;
      setIsUploading(false);
      console.log("Upload cancelled by user");
    }
  }, []);

  return {
    uploadImages,
    isUploading,
    uploadError,
    uploadProgress,
    resetUploadState,
    cancelUpload,
  };
};

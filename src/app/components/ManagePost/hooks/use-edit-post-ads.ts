import { useState } from "react";
import { ServiceSelection } from "../../PostAd/PostServiceFormComponents";
import {
  LocationProps,
  useEditPostFormContext,
} from "../context/EditPostContext";

export interface UploadedImage {
  id: string;
  file?: File | null;
  preview: string;
  isMain?: boolean;
}

export interface PostServiceFormData {
  service: ServiceSelection;
  location: LocationProps;
  images: string[];
}

export interface PostServiceFormCallbacks {
  onClear?: () => Promise<boolean> | void;
  onServiceSelect?: (service: ServiceSelection) => void;
  onLocationSelect?: (city: string, region: string) => void;
  onBack?: () => void;
  onSubmit?: (data: PostServiceFormData) => void;
}

export const useEditPostForm = () => {
  const {
    selectedService,
    setSelectedService,
    selectedLocation,
    setSelectedLocation,
    images,
    setImages,
    handleClearService,
    clearForm,
  } = useEditPostFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceSelect = (service: ServiceSelection) => {
    setSelectedService(service);
  };

  const handleLocationSelect = (city: string, region: string) => {
    setSelectedLocation({ city, region });
  };

  const handleImagesChange = (
    hasImages: boolean,
    uploadedImages?: UploadedImage[] | string[]
  ) => {
    if (!uploadedImages) return;

    // If caller provided an array of strings (server URLs), convert to UploadedImage[]
    if (
      Array.isArray(uploadedImages) &&
      typeof uploadedImages[0] === "string"
    ) {
      const urls = uploadedImages as string[];
      const imgs: UploadedImage[] = urls.map((url, idx) => ({
        id: `from-urls-${idx}-${Math.random().toString(36).substr(2, 9)}`,
        file: null,
        preview: url,
        isMain: idx === 0,
      }));
      setImages(imgs);
      return;
    }

    // Otherwise assume UploadedImage[]
    setImages(uploadedImages as UploadedImage[]);
  };

  return {
    selectedService,
    selectedLocation,
    images,
    isSubmitting,
    handleServiceSelect,
    handleLocationSelect,
    handleImagesChange,
    handleClearService,
  };
};

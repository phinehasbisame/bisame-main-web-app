import { createContext, useContext, useState, ReactNode } from "react";
import {
  ServiceSelection,
  UploadedImage,
} from "../../PostAd/PostServiceFormComponents";
import { useEditPostForm } from "../hooks/use-edit-post-ads";

export interface AllCategoriesProps {
  category: string;
  subCategory: string;
}

export interface LocationProps {
  city: string;
  region: string;
}

interface EditPostFormContextType {
  selectedService: ServiceSelection | null;
  setSelectedService: (service: ServiceSelection | null) => void;
  selectedLocation: LocationProps;
  setSelectedLocation: (location: LocationProps) => void;
  images: UploadedImage[];
  setImages: (images: UploadedImage[]) => void;
  clearForm: () => void;
  handleClearService: () => void;
  allCategories: AllCategoriesProps | undefined;
  updateCategories: (categories: AllCategoriesProps) => void;
}

const EditPostFormContext = createContext<EditPostFormContextType | undefined>(
  undefined
);

export const EditPostFormProvider = ({ children }: { children: ReactNode }) => {
  const [selectedService, setSelectedService] =
    useState<ServiceSelection | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<LocationProps>({
    city: "",
    region: "",
  });

  const [images, setImages] = useState<UploadedImage[]>([]);

  const [allCategories, setAllCategories] = useState<AllCategoriesProps>();

  const updateCategories = (categories: AllCategoriesProps) => {
    setAllCategories(categories);
  };

  const clearForm = () => {
    setSelectedService(null);
    setSelectedLocation({ city: "", region: "" });
    setImages([]);
    setAllCategories(undefined);
  };

  const handleClearService = () => {
    setSelectedService(null);
  };

  return (
    <EditPostFormContext.Provider
      value={{
        selectedService,
        setSelectedService,
        selectedLocation,
        setSelectedLocation,
        images,
        setImages,
        clearForm,
        allCategories,
        updateCategories,
        handleClearService,
      }}
    >
      {children}
    </EditPostFormContext.Provider>
  );
};

export const useEditPostFormContext = () => {
  const context = useContext(EditPostFormContext);
  if (!context) {
    throw new Error(
      "useEditPostFormContext must be used within a EditPostFormContext"
    );
  }
  return context;
};

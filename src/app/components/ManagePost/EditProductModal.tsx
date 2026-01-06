import { useState, useRef, useMemo, memo, useEffect } from "react";
import toast from "react-hot-toast";
import { UpdateProductProps } from "./interfaces";
import { useImageManager } from "./hooks/use-image-handler";
import { useProductForm } from "./hooks/use-product-form";
import { useImageUpload } from "./hooks/use-image-upload";
import { LuLoaderCircle } from "react-icons/lu";
import EditImage from "./components/EditImage";
import { useProductData } from "../ProductDetails/hooks/useProductData";
import LocationSelector from "../PostAd/LocationSelector";
import { EditPostFormProvider } from "./context/EditPostContext";
import { Group } from "@/app/sell/allcategory/utils/categories";
import {
  handleEditGroupInput,
  HandleGroupInputProps,
} from "./utils/use-edit-post-category";
import useFetchEditFormOptions from "./hooks/use-fetch-form-options";
import EditPostAttributes from "./components/EditPostAttributes";
import EditActionButtons from "./EditActionButtons";
import { useEditPostForm } from "./hooks/use-edit-post-ads";

// Helper function to format attribute keys to readable labels
const formatLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Define which attributes are required based on category
const getRequiredAttributes = (
  categoryGroup: string,
  category: string
): string[] => {
  if (categoryGroup === "Jobs") {
    return ["employmentType", "jobType", "workSetup"];
  }
  return [];
};

import { Product } from "./types/index";
import dynamic from "next/dynamic";

export interface EditProductModalProps {
  id: string;
  isOpen: boolean;
  product?: Product | null;
  loading?: boolean;
  error?: unknown;
  onUpdate: (payload: UpdateProductProps) => void;
  onCancel: () => void;
  userName?: string;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  id,
  isOpen,
  product,
  loading: externalLoading,
  error: externalError,
  onUpdate,
  onCancel,
  userName = "user",
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const {
    product: newProductData,
    isLoading: isLoadingProduct,
    hasError,
    error: errorProduct,
  } = useProductData(id);

  const isLoading = externalLoading ?? isLoadingProduct;
  const loadError = externalError ?? errorProduct;
  const productData = newProductData || product;

  const { formData, handleChange, updateField, resetAttributes } =
    useProductForm({
      productData: productData,
    });

  console.log(formData);
  console.log(formData);
  console.log(formData);
  console.log(formData);
  console.log(formData);
  console.log(formData);
  console.log(formData);
  console.log(formData);

  const [group, setGroup] = useState<Group>(formData?.categoryGroup as Group);

  // Track whether we're using dynamically fetched attributes
  const [isDynamicSchema, setIsDynamicSchema] = useState(false);

  // Store dynamic attributes separately to avoid confusion
  const [dynamicAttributes, setDynamicAttributes] = useState<
    Record<string, any>
  >({});

  const {
    selectedService: newSelectedService,
    selectedLocation: newSelectedLocation,
    isSubmitting: hasSubmitting,
    handleServiceSelect,
    handleLocationSelect,
    handleImagesChange,
    handleClearService,
  } = useEditPostForm();

  const { data: fetchFormOptions } = useFetchEditFormOptions(
    id,
    newSelectedService?.category,
    newSelectedService?.subcategory,
    group
  );

  // NOTE: Reset attributes when group or service changes
  useEffect(() => {
    if (newSelectedService?.category || newSelectedService?.subcategory) {
      // When service changes, clear all attributes and mark as dynamic schema
      setIsDynamicSchema(true);
      setDynamicAttributes({});

      // Clear attributes from main form state
      if (resetAttributes) {
        resetAttributes();
      } else {
        updateField("attributes", {});
      }
    }
  }, [newSelectedService?.category, newSelectedService?.subcategory]);

  useEffect(() => {
    if (group && group !== formData?.categoryGroup) {
      // When group changes, clear all attributes and mark as dynamic schema
      setIsDynamicSchema(true);
      setDynamicAttributes({});

      // Clear attributes from main form state
      if (resetAttributes) {
        resetAttributes();
      } else {
        updateField("attributes", {});
      }
    }
  }, [group]);

  // **Handle dynamic attribute changes - store in separate state**
  const handleDynamicAttributeChange = (field: string, value: string) => {
    setDynamicAttributes((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxInputChange = (field: string, value: string[]) => {
    setDynamicAttributes((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const props = useMemo(
    () => ({
      onServiceSelect: handleServiceSelect,
      selectedService: {
        category: newSelectedService?.category ?? formData?.category,
        subcategory: newSelectedService?.subcategory ?? formData?.subCategory,
      },
    }),
    [
      handleServiceSelect,
      newSelectedService,
      formData?.category,
      formData?.subCategory,
    ]
  );

  const { uploadImages } = useImageUpload({ userName });

  const {
    images,
    isUploading,
    uploadError,
    isDragOver,
    handleFileSelect,
    removeImage,
    setMainImage,
    handleDragStart,
    handleDragEnd,
    handleDragOverReorder,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    getImageUrls,
  } = useImageManager({
    initialImages: productData?.images
      ? Array.isArray(productData.images)
        ? productData.images
        : [productData.images]
      : [],
    maxImages: 10,
    maxFileSizeMB: 5,
    onUpload: uploadImages,
  });

  // Legacy attribute handler (only used if not in dynamic mode)
  const handleAttributeChange = (key: string, value: any) => {
    if (!isDynamicSchema) {
      updateField("attributes", {
        ...formData?.attributes,
        [key]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const imageUrls = getImageUrls();

      // **CRITICAL: Use ONLY dynamic attributes if in dynamic mode**
      const finalAttributes = isDynamicSchema
        ? dynamicAttributes
        : formData.attributes || {};

      const reqBody: UpdateProductProps = {
        id,
        title: formData.title || formData.name,
        description: formData.description,
        price: Number(formData.price) || 0,
        location: formData.location,
        category: formData.category || "",
        subCategory: formData.subCategory || "",
        childCategory: formData.childCategory || null,
        contactNumber: formData.contactNumber || "",
        images: imageUrls.map((url, index) => ({
          imageUrl: url,
          id: `image-${index}`,
        })),
        isPromoted: false,
        negotiable:
          typeof formData.negotiable === "boolean"
            ? formData.negotiable
            : formData.negotiable === "true",
        attributes: finalAttributes, // ← Only current schema attributes
      };

      await onUpdate(reqBody);

      setShowSuccess(true);
      toast.success("Product updated successfully!");

      setTimeout(() => {
        setShowSuccess(false);
        onCancel();
      }, 1200);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 flex flex-col items-center">
          <LuLoaderCircle className="w-12 h-12 text-orange-400 animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (!productData || !formData) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 flex flex-col items-center">
          <p className="text-red-600 font-semibold mb-2">
            {loadError ? "Failed to load product" : "Product not found"}
          </p>
          <p className="text-gray-500 text-sm max-w-xs text-center">
            {loadError
              ? String(loadError)
              : "Unable to load product data. Please try again."}
          </p>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const onPickImage = (): void => {
    imageRef.current?.click();
  };

  const requiredAttributes = getRequiredAttributes(
    formData.categoryGroup || "",
    formData.category || ""
  );

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-6 relative overflow-y-auto scrollbar-hide max-h-[90vh]"
      >
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-orange-500 text-2xl focus:outline-none z-20"
          onClick={onCancel}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Edit Product
        </h2>

        <div className="space-y-6">
          <EditImage
            images={images}
            imageRef={imageRef}
            onImageFiles={handleFileSelect}
            onPickImage={onPickImage}
            onRemove={removeImage}
            onSetMain={setMainImage}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOverReorder}
            onDrop={handleDrop}
            onDragOverZone={handleDragOver}
            onDragLeaveZone={handleDragLeave}
            isDragOver={isDragOver}
            isUploading={isUploading}
            uploadError={uploadError}
            maxImages={10}
            maxFileSizeMB={5}
          />

          <div>
            <label className="block text-sm font-semibold mb-1">
              Post Group
            </label>
            <select
              className="border w-full p-2 rounded text-sm"
              value={group ?? formData.categoryGroup}
              onChange={(event) => {
                setGroup(event.target.value as Group);
                handleClearService();
              }}
            >
              <option value="Buy and Sell">Products</option>
              <option value="Books">Books</option>
              <option value="Food">Foods</option>
              <option value="Jobs">Jobs</option>
              <option value="Job Seekers">Job Seekers</option>
              <option value="Health">Health</option>
              <option value="Services">Services</option>
            </select>
          </div>

          {formData.categoryGroup
            ? handleEditGroupInput(
                group ?? (formData.categoryGroup as Group),
                props as HandleGroupInputProps
              )
            : null}

          <LocationSelector
            selectedLocation={
              newSelectedLocation.city && newSelectedLocation.region
                ? newSelectedLocation
                : {
                    city: formData.location,
                    region: "",
                  }
            }
            onSelect={handleLocationSelect}
          />

          <div>
            <label className="block text-sm font-semibold mb-1">
              Product Title
            </label>
            <input
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.price !== undefined && formData.price !== "" && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Dynamic Attributes Section */}
          <EditPostAttributes
            data={fetchFormOptions?.data as unknown[]}
            formData={
              isDynamicSchema ? { attributes: dynamicAttributes } : formData
            }
            onAttributeChange={
              isDynamicSchema
                ? handleDynamicAttributeChange
                : handleAttributeChange
            }
            requiredAttributes={requiredAttributes}
            formatLabel={formatLabel}
            onDynamicAttributeChange={handleDynamicAttributeChange}
            onCheckboxInputChange={handleCheckboxInputChange}
          />

          {formData.contactNumber !== undefined && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Contact Number
              </label>
              <input
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter contact number"
              />
            </div>
          )}

          {formData.negotiable !== undefined && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="negotiable"
                checked={
                  typeof formData.negotiable === "boolean"
                    ? formData.negotiable
                    : formData.negotiable === "true"
                }
                onChange={(e) => updateField("negotiable", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Price is negotiable
              </label>
            </div>
          )}
        </div>

        <EditActionButtons
          onCancel={onCancel}
          showSuccess={showSuccess}
          isSubmitting={isSubmitting}
          isUploading={isUploading}
        />
      </form>
    </div>
  );
};

const EditProductModalProvider = ({ ...props }: EditProductModalProps) => (
  <EditPostFormProvider>
    <EditProductModal {...props} />
  </EditPostFormProvider>
);

export default memo(EditProductModalProvider);

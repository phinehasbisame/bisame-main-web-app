import { useState, useRef, useMemo, memo, useEffect, useCallback } from "react";
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
import { Product } from "./types/index";
import KeyProductDropdown from "../Forms/Products/KeyProductDropdown";
import { FormOptions } from "../Forms/Books/interfaces";

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

  // Fetch product data
  const {
    product: newProductData,
    isLoading: isLoadingProduct,
    hasError,
    error: errorProduct,
  } = useProductData(id);

  const isLoading = externalLoading ?? isLoadingProduct;
  const loadError = externalError ?? errorProduct;
  const productData = newProductData || product;

  // Initialize form
  const { formData, handleChange, updateField, resetAttributes } =
    useProductForm({
      productData: productData,
    });

  const [group, setGroup] = useState<Group>(
    (formData?.categoryGroup as Group) || "Buy and Sell"
  );

  // Track dynamic schema state
  const [isDynamicSchema, setIsDynamicSchema] = useState(false);
  const [dynamicAttributes, setDynamicAttributes] = useState<
    Record<string, any>
  >({});

  // Edit post form handlers
  const {
    selectedService: newSelectedService,
    selectedLocation: newSelectedLocation,
    handleServiceSelect,
    handleLocationSelect,
    handleClearService,
  } = useEditPostForm();

  // Fetch dynamic form options
  const { data: fetchFormOptions, isLoadingForm } = useFetchEditFormOptions<FormOptions[]>(
    id,
    newSelectedService?.category,
    newSelectedService?.subcategory,
    group
  );

  // Image upload setup
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

  // Reset attributes when category/service changes
  useEffect(() => {
    if (newSelectedService?.category || newSelectedService?.subcategory) {
      setIsDynamicSchema(true);
      setDynamicAttributes({});
      if (resetAttributes) {
        resetAttributes();
      } else {
        updateField("attributes", {});
      }
    }
  }, [
    newSelectedService?.category,
    newSelectedService?.subcategory,
    resetAttributes,
    updateField,
  ]);

  // Reset attributes when group changes
  useEffect(() => {
    if (group && group !== formData?.categoryGroup) {
      setIsDynamicSchema(true);
      setDynamicAttributes({});
      if (resetAttributes) {
        resetAttributes();
      } else {
        updateField("attributes", {});
      }
    }
  }, [group, formData?.categoryGroup, resetAttributes, updateField]);

  // Handle dynamic attribute changes
  const handleDynamicAttributeChange = useCallback(
    (field: string, value: string) => {
      setDynamicAttributes((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleCheckboxInputChange = useCallback(
    (field: string, value: string[]) => {
      setDynamicAttributes((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Legacy attribute handler (for existing attributes)
  const handleAttributeChange = useCallback(
    (key: string, value: any) => {
      if (!isDynamicSchema && formData) {
        updateField("attributes", {
          ...formData.attributes,
          [key]: value,
        });
      }
    },
    [isDynamicSchema, formData, updateField]
  );

  // Service selector props
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const imageUrls = getImageUrls();

      // Use dynamic attributes if in dynamic mode, otherwise use existing attributes
      const finalAttributes = isDynamicSchema
        ? dynamicAttributes
        : formData.attributes || {};

      // Build update payload
      const reqBody: UpdateProductProps = {
        id,
        title: formData.title || formData.name,
        description: formData.description,
        price: Number(formData.price) || 0,
        location: newSelectedLocation.city || formData.location,
        category: newSelectedService?.category || formData.category || "",
        subCategory:
          newSelectedService?.subcategory || formData.subCategory || "",
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
        attributes: finalAttributes,
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

  const onPickImage = useCallback((): void => {
    imageRef.current?.click();
  }, []);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 flex flex-col items-center">
          <LuLoaderCircle className="w-16 h-16 text-orange-500 animate-spin mb-4" />
          <p className="text-gray-600 text-base font-medium">
            Loading product data...
          </p>
        </div>
      </div>
    );
  }

  if (!productData || !formData) {
    return (
      <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-red-600 font-semibold text-lg mb-2">
            {loadError ? "Failed to load product" : "Product not found"}
          </p>
          <p className="text-gray-500 text-sm text-center mb-6">
            {loadError
              ? String(loadError)
              : "Unable to load product data. Please try again."}
          </p>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const requiredAttributes = getRequiredAttributes(
    formData.categoryGroup || "",
    formData.category || ""
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div
          className="relative flex items-center justify-between px-6 py-4 
                bg-gradient-to-r from-blue-700 to-blue-600 
                border-b border-blue-800/40"
        >
          {/* Title Section */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-white leading-tight">
              Edit Product
            </h2>
            <span className="text-sm text-blue-100/80">
              Update product details and availability
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex items-center justify-center w-10 h-10 
               rounded-full text-white/80 
               hover:text-white hover:bg-white/10 
               transition-all duration-200 focus:outline-none"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-6 space-y-6 flex-1">
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Group
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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

          {formData.categoryGroup &&
            handleEditGroupInput(
              group ?? (formData.categoryGroup as Group),
              props as HandleGroupInputProps
            )}

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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              required
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              rows={4}
              required
              placeholder="Describe your product"
            />
          </div>

          {formData.price !== undefined && formData.price !== "" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (GHS)
              </label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          )}

          {/* Dynamic Attributes Section */}
          <EditPostAttributes
            data={fetchFormOptions?.data as FormOptions[]}
            isDataLoading={isLoadingForm}
            formData={
              isDynamicSchema
                ? dynamicAttributes
                : (formData?.attributes as Record<string, any>)
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

          {/* Service Keywords for Services Group */}
          {group === "Services" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Keywords
              </label>
              <KeyProductDropdown
                selectedServices={
                  ((isDynamicSchema
                    ? dynamicAttributes.serviceKeywords
                    : formData.serviceKeywords) as string[]) || []
                }
                onServicesChange={(services) =>
                  handleCheckboxInputChange("serviceKeywords", services)
                }
                required={true}
                category={newSelectedService?.category as string}
                subCategory={newSelectedService?.subcategory as string}
              />
            </div>
          )}

          {formData.contactNumber !== undefined && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Enter contact number"
              />
            </div>
          )}

          {formData.negotiable !== undefined && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                name="negotiable"
                id="negotiable"
                checked={
                  typeof formData.negotiable === "boolean"
                    ? formData.negotiable
                    : formData.negotiable === "true"
                }
                onChange={(e) => updateField("negotiable", e.target.checked)}
                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label
                htmlFor="negotiable"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Price is negotiable
              </label>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <EditActionButtons
            onCancel={onCancel}
            showSuccess={showSuccess}
            isSubmitting={isSubmitting}
            isUploading={isUploading}
          />
        </div>
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

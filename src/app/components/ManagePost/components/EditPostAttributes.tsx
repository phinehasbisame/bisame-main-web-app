import { memo } from "react";
import dynamic from "next/dynamic";
import { FormOptions } from "../../Forms/Books/interfaces";
import FormContext from "../../Forms/Foods/context/FormContext";
import Loader from "../../Loader/Loader";

type ObjectProps = Record<string, string | string[] | (string | string[])[]>;

const ProductsFields = dynamic(
  () => import("@/app/components/Forms/Products/ProductsFields"),
  { ssr: false }
);

interface EditPostAttributesProps {
  data?: unknown[] | string[] | { [key: string]: unknown; message?: string };
  isDataLoading?: boolean;
  formData: Record<string, any>;
  requiredAttributes: string[];
  formatLabel: (key: string) => string;
  onDynamicAttributeChange: (field: string, value: string) => void;
  onCheckboxInputChange: (field: string, value: string[]) => void;
  onAttributeChange: (key: string, value: any) => void;
}

const EditPostAttributes = ({
  data,
  isDataLoading,
  formData,
  requiredAttributes,
  formatLabel,
  onAttributeChange,
  onDynamicAttributeChange,
  onCheckboxInputChange,
}: EditPostAttributesProps) => {
  // Check if data is an array and has items
  const hasFormOptions = Array.isArray(data) && data.length > 0;

  // Check if formData has attributes to display as legacy fields
  const hasLegacyAttributes =
    formData &&
    typeof formData === "object" &&
    Object.keys(formData).length > 0 &&
    !hasFormOptions;

  return (
    <>
      {hasFormOptions ? (
        // Dynamic form with fetched options
        <FormContext>
          {isDataLoading ? (
            <div className="py-8">
              <Loader />
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Additional Details
              </h3>
              <ProductsFields
                data={data as FormOptions[]}
                formData={formData as ObjectProps}
                handleCheckboxInputChange={onCheckboxInputChange}
                handleInputChange={onDynamicAttributeChange}
              />
            </div>
          )}
        </FormContext>
      ) : hasLegacyAttributes ? (
        // Legacy attributes (existing product data without dynamic form)
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => {
              // Skip non-attribute fields
              if (
                [
                  "title",
                  "description",
                  "price",
                  "location",
                  "images",
                  "category",
                  "subCategory",
                  "categoryGroup",
                ].includes(key)
              ) {
                return null;
              }

              const isRequired = requiredAttributes?.includes(key);
              const label = formatLabel(key);

              // Handle different value types
              if (typeof value === "boolean") {
                return (
                  <div key={key} className="col-span-1 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={key}
                      checked={value}
                      onChange={(e) => onAttributeChange(key, e.target.checked)}
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label
                      htmlFor={key}
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {label}
                    </label>
                  </div>
                );
              }

              // Handle array values (multi-select)
              if (Array.isArray(value)) {
                return (
                  <div key={key} className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {label}
                      {isRequired && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={value.join(", ")}
                      onChange={(e) => {
                        const newValues = e.target.value
                          .split(",")
                          .map((v) => v.trim())
                          .filter(Boolean);
                        onAttributeChange(key, newValues);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder={`Enter ${label.toLowerCase()} (comma-separated)`}
                      required={isRequired}
                    />
                  </div>
                );
              }

              // Text input for string values
              return (
                <div key={key} className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    value={String(value || "")}
                    onChange={(e) => onAttributeChange(key, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required={isRequired}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default memo(EditPostAttributes);

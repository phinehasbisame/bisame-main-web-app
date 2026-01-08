import { memo } from "react";
import { FormData } from "../hooks/use-product-form";
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
  data?: unknown[] | string[] | { [key: string]: unknown; message?: string | undefined };
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
  return (
    <>
      {data?.length == 0 ? (
        formData.attributes &&
        Object.keys(formData.attributes).length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.attributes).map(([key, value]) => {
                const isRequired = requiredAttributes?.includes(key);
                const label = formatLabel(key);

                // Render different input types based on the key or value type
                return (
                  <div key={key} className="col-span-1">
                    <label className="block text-sm font-semibold mb-1">
                      {label}
                      {isRequired && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>

                    {/* Text input for most fields */}
                    <input
                      type="text"
                      value={(value as string) || ""}
                      onChange={(e) => onAttributeChange(key, e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={isRequired}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        <FormContext>
          {isDataLoading ? (
            <Loader />
          ) : data ? (
            <ProductsFields
              data={data as FormOptions[]}
              formData={formData as ObjectProps}
              handleCheckboxInputChange={onCheckboxInputChange}
              handleInputChange={onDynamicAttributeChange}
            />
          ) : null}
        </FormContext>
      )}
    </>
  );
};

export default memo(EditPostAttributes);

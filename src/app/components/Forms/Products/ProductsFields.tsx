import React from "react";
import DynamicFormDisplay from "../Books/components/DynamicFormDisplay";
import { FormOptions } from "../Books/interfaces";

interface EngineFieldsProps {
  data: FormOptions[];
  formData: Record<string, string | string[] | (string | string[])[]>;
  handleInputChange: (field: string, value: string) => void;
  handleCheckboxInputChange?: (field: string, value: string[]) => void;
}

const ProductsFields: React.FC<EngineFieldsProps> = ({
  data,
  formData,
  handleInputChange,
  handleCheckboxInputChange
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5">
        <DynamicFormDisplay
          formData={formData}
          data={data}
          handleCheckboxInputChange={handleCheckboxInputChange}
          handleInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ProductsFields;

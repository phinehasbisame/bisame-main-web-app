import React from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { CheckCircle } from "lucide-react";

interface EditActionButtonsProps {
  onCancel: () => void;
  showSuccess: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
}

const EditActionButtons: React.FC<EditActionButtonsProps> = ({
  onCancel,
  showSuccess,
  isSubmitting,
  isUploading,
}) => {
  const isDisabled = isSubmitting || isUploading;

  const buttonLabel = showSuccess
    ? "Product Updated"
    : isSubmitting
    ? "Updating Product"
    : isUploading
    ? "Uploading Assets"
    : "Update Product";

  return (
    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
      {/* Cancel */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isDisabled}
        className="
          px-6 py-2.5 rounded-lg
          border border-gray-300
          text-gray-700 bg-white
          hover:bg-gray-50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all font-medium
        "
      >
        Cancel
      </button>

      {/* Primary Action */}
      <button
        type="submit"
        disabled={isDisabled || showSuccess}
        className={`
          px-6 py-2.5 min-w-[160px]
          rounded-lg font-semibold
          flex items-center justify-center gap-2
          text-white transition-all
          shadow-md hover:shadow-lg
          bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        {isSubmitting || isUploading ? (
          <>
            <LuLoaderCircle className="w-5 h-5 animate-spin" />
            <span>{buttonLabel}</span>
          </>
        ) : (
          <span>{buttonLabel}</span>
        )}
      </button>
    </div>
  );
};

export default EditActionButtons;

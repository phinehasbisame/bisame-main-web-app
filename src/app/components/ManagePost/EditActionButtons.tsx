"use client";

import { LuLoaderCircle } from "react-icons/lu";

interface EditActionButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isUploading: boolean;
  showSuccess: boolean;
}

const EditActionButtons = ({
  onCancel,
  isSubmitting,
  isUploading,
  showSuccess,
}: EditActionButtonsProps) => {
  return (
    <div className="flex gap-4 mt-8">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        disabled={isSubmitting || isUploading}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isSubmitting || isUploading}
      >
        {isSubmitting || isUploading ? (
          <span className="flex items-center">
            <LuLoaderCircle className="w-4 h-4 animate-spin mr-2" />
            {isUploading ? "Uploading..." : "Updating..."}
          </span>
        ) : showSuccess ? (
          <span className="flex items-center">
            <span className="mr-2">✅</span> Success!
          </span>
        ) : (
          "Update Product"
        )}
      </button>
    </div>
  );
};

export default EditActionButtons;

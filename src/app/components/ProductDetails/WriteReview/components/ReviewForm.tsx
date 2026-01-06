"use client";

import { MessageCircle, Info } from "lucide-react";
import StarRating from "./StarRating";
import ReviewComment from "./ReviewComment";
import { useReviewForm } from "../hooks/useReviewForm";
import { useSearchParams } from "next/navigation";

interface ReviewFormProps {
  onReviewSubmit?: (rating: number, comment: string) => Promise<void> | void;
  onClose: () => void;
}

const ReviewForm = ({ onReviewSubmit, onClose }: ReviewFormProps) => {
  const listingId = useSearchParams().get("id") as string;

  const {
    rating,
    hoveredRating,
    comment,
    isSubmitting,
    isFormValid,
    setComment,
    handleSubmit,
    handleStarClick,
    handleStarHover,
    handleStarLeave,
    resetForm,
  } = useReviewForm({ onReviewSubmit, onClose, listingId });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-8 space-y-8"
      aria-labelledby="review-form-title"
    >
      {/* Header */}
      <header className="border-b border-gray-100 pb-5 space-y-1">
        <h2
          id="review-form-title"
          className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight"
        >
          Write a review
        </h2>
        <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
          Share your experience to help other customers evaluate this product.
        </p>
      </header>

      {/* Rating */}
      <section className="space-y-2">
        <StarRating
          rating={rating}
          hoveredRating={hoveredRating}
          isSubmitting={isSubmitting}
          onStarClick={handleStarClick}
          onStarHover={handleStarHover}
          onStarLeave={handleStarLeave}
        />
      </section>

      {/* Review comment */}
      <section className="space-y-2">
        
        <ReviewComment
          // id="review-comment"
          comment={comment}
          setComment={setComment}
          isSubmitting={isSubmitting}
        />
        <div className="flex items-start gap-2 text-xs text-gray-400">
          <Info size={14} className="mt-0.5" />
          <p>
            Reviews are public and must follow our community guidelines. Avoid
            personal or sensitive information.
          </p>
        </div>
      </section>

      {/* Actions */}
      <footer className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Submitting review
            </span>
          ) : (
            "Submit review"
          )}
        </button>
      </footer>
    </form>
  );
};

export default ReviewForm;

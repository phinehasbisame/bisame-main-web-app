"use client";

import { useState, useCallback } from "react";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { useProductReviews } from "@/app/components/ProductDetails/hooks/useProductReviews";
import { buildProfileUrl, REVIEW_ENDPOINTS, tokenManager } from "@/lib";

interface UseReviewFormProps {
  listingId: string;
  onReviewSubmit?: (rating: number, comment: string) => Promise<void> | void;
  onClose: () => void;
}

export const useReviewForm = ({
  onReviewSubmit,
  onClose,
  listingId,
}: UseReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const isFormValid = rating > 0 && comment.trim().length >= 10;

  const postReviewFn = useCallback(
    async (
      url: string,
      {
        arg,
      }: {
        arg: {
          listingId: string;
          rating: number;
          comment: string;
          attachments: string[];
        };
      }
    ) => {
      const apiUrl = buildProfileUrl(REVIEW_ENDPOINTS.listingReviews);
      const token = tokenManager.getToken();
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok || data.code !== 200) {
        throw new Error(data.message || "Failed to submit review");
      }
      return data;
    },
    []
  );

  const { trigger, isMutating } = useSWRMutation(
    "/api/ProductReview/PostReview",
    postReviewFn
  );
  const { refetchReviews } = useProductReviews();

  const resetForm = () => {
    setRating(0);
    setComment("");
    setHoveredRating(0);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) {
        toast.error(
          "Please provide a rating and a comment of at least 10 characters."
        );
        return;
      }

      if (!listingId) {
        toast.error("Product ID not found.");
        return;
      }

      const body = {
        listingId,
        rating,
        comment,
        attachments: [],
      };

      try {
        await trigger(body);
        if (onReviewSubmit) {
          await onReviewSubmit(rating, comment);
        }
        toast.success("Review submitted successfully!");
        if (refetchReviews) await refetchReviews();
        resetForm();
        onClose();
      } catch (error: unknown) {
        toast.error(
          (error as Error)?.message ||
            "Failed to submit review. Please try again."
        );
      }
    },
    [
      rating,
      comment,
      isFormValid,
      onReviewSubmit,
      onClose,
      trigger,
      refetchReviews,
    ]
  );

  const handleStarClick = (starRating: number) => setRating(starRating);
  const handleStarHover = (starRating: number) => setHoveredRating(starRating);
  const handleStarLeave = () => setHoveredRating(0);

  return {
    rating,
    hoveredRating,
    comment,
    isSubmitting: isMutating,
    isFormValid,
    setComment,
    handleSubmit,
    handleStarClick,
    handleStarHover,
    handleStarLeave,
    resetForm,
  };
};

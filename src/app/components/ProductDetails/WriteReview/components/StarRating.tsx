"use client";

import { Star } from "lucide-react";

const ratingMap: Record<
  number,
  { label: string; description: string; color: string }
> = {
  1: {
    label: "Poor",
    description: "Very disappointing experience",
    color: "text-red-500",
  },
  2: {
    label: "Fair",
    description: "Below expectations",
    color: "text-orange-500",
  },
  3: {
    label: "Good",
    description: "Meets expectations",
    color: "text-yellow-500",
  },
  4: {
    label: "Very Good",
    description: "Above expectations",
    color: "text-blue-500",
  },
  5: {
    label: "Excellent",
    description: "Outstanding quality",
    color: "text-green-500",
  },
};

interface StarRatingProps {
  rating: number;
  hoveredRating: number;
  isSubmitting: boolean;
  onStarClick: (rating: number) => void;
  onStarHover: (rating: number) => void;
  onStarLeave: () => void;
}

const StarRating = ({
  rating,
  hoveredRating,
  isSubmitting,
  onStarClick,
  onStarHover,
  onStarLeave,
}: StarRatingProps) => {
  const activeRating = hoveredRating || rating;
  const ratingInfo = activeRating ? ratingMap[activeRating] : null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          id="star-rating-label"
          className="text-sm font-medium text-gray-700"
        >
          Overall rating
        </label>
        {ratingInfo && (
          <span className={`text-sm font-semibold ${ratingInfo.color}`}>
            {ratingInfo.label}
          </span>
        )}
      </div>

      <div
        role="radiogroup"
        aria-labelledby="star-rating-label"
        className="flex items-center gap-2"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} star rating`}
            disabled={isSubmitting}
            onClick={() => onStarClick(star)}
            onMouseEnter={() => onStarHover(star)}
            onMouseLeave={onStarLeave}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onStarClick(star);
              }
            }}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed"
          >
            <Star
              size={32}
              className={`transition-all duration-200 ${
                star <= activeRating
                  ? "fill-yellow-400 text-yellow-400 scale-110"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="min-h-[1.25rem]">
        {ratingInfo && (
          <p className="text-xs text-gray-500">{ratingInfo.description}</p>
        )}
      </div>
    </section>
  );
};

export default StarRating;

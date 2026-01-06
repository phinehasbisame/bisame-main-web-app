"use client";

interface ReviewCommentProps {
  comment: string;
  setComment: (comment: string) => void;
  isSubmitting: boolean;
}

const MIN_CHARS = 10;
const MAX_CHARS = 500;

const ReviewComment = ({
  comment,
  setComment,
  isSubmitting,
}: ReviewCommentProps) => {
  const isTooShort = comment.length > 0 && comment.length < MIN_CHARS;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="review-comment"
          className="text-sm font-medium text-gray-700"
        >
          Written review
        </label>
        <span className="text-xs text-gray-400" aria-live="polite">
          {comment.length}/{MAX_CHARS}
        </span>
      </div>

      <textarea
        id="review-comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Describe what you liked or disliked about the product."
        rows={4}
        disabled={isSubmitting}
        maxLength={MAX_CHARS}
        className={`
          w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900
          placeholder:text-gray-400 resize-none transition
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
          disabled:bg-gray-50 disabled:opacity-60
          ${isTooShort ? "border-red-300" : "border-gray-300"}
        `}
        aria-required="true"
        aria-invalid={isTooShort}
        aria-describedby="review-guidelines"
      />

      <p
        id="review-guidelines"
        className={`text-xs ${isTooShort ? "text-red-500" : "text-gray-500"}`}
      >
        Minimum {MIN_CHARS} characters. Focus on product quality, usage, and
        value.
      </p>
    </div>
  );
};

export default ReviewComment;

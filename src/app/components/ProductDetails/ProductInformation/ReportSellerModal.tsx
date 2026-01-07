import React, { useState } from "react";
import ReactDOM from "react-dom";

interface ReportSellerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const REASONS = [
  { id: "unsatisfactory", label: "Unsatisfactory service", icon: "⚠️" },
  { id: "fraudulent", label: "Fraudulent or illegal activity", icon: "🚫" },
  { id: "prepayment", label: "Asked for prepayment", icon: "💳" },
  { id: "other", label: "Other", icon: "📝" },
];

const ReportSellerModal: React.FC<ReportSellerModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || typeof window === "undefined") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await onSubmit(reason, details);
      setReason("");
      setDetails("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center px-5 justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Report User</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
          {/* Reason selection */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">
              Reason for report
            </p>
            <div className="space-y-2">
              {REASONS.map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition
                    ${
                      reason === item.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="flex-1 text-sm text-gray-800">
                    {item.label}
                  </span>
                  <input
                    type="radio"
                    name="report-reason"
                    value={item.id}
                    checked={reason === item.id}
                    onChange={() => setReason(item.id)}
                    className="sr-only"
                  />
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center
                      ${
                        reason === item.id
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {reason === item.id && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Additional details (optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={500}
              disabled={isSubmitting}
              placeholder="Provide more context if necessary..."
              className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              rows={4}
            />
            <div className="mt-1 text-right text-xs text-gray-400">
              {details.length}/500
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !reason}
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white transition
                ${
                  isSubmitting || !reason
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }
              `}
            >
              {isSubmitting ? "Submitting…" : "Submit report"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ReportSellerModal;

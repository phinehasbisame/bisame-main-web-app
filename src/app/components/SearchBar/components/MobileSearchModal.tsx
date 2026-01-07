"use client";

import { useEffect, useRef, useCallback, memo } from "react";
import {
  FaSearch,
  FaTimes,
  FaArrowLeft,
  FaFire,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorMessage } from "./";
import SearchSuggestions from "../SearchSuggestions";
import { useSearchData } from "../hooks";
import { SearchBarProps } from "../types";
import usePopularData from "../hooks/usePopularData";
import Button from "../../ui/Button";
import { MdKeyboardArrowLeft } from "react-icons/md";

interface MobileSearchModalProps extends Omit<SearchBarProps, "className"> {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose,
  onSearchError,
  placeholder = "Search products...",
  defaultLocation = "Ghana",
  navigateOnSearch = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get popular searches from api from custom hook
  const { getData } = usePopularData();

  // Use the same search logic as the main SearchBar
  const {
    searchTerm,
    isLoading,
    error,
    isSuggestionsVisible,
    setIsSuggestionsVisible,
    handleSearch,
    handleSuggestionClick,
    handleInputChange,
  } = useSearchData({
    defaultLocation,
    navigateOnSearch,
    onSearchError,
  });

  // Memoized handlers
  const handleSearchClick = useCallback(() => {
    const form = document.getElementById(
      "mobile-search-form"
    ) as HTMLFormElement;
    if (form) {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchClick();
      }
      if (e.key === "Escape") {
        onClose();
      }
    },
    [handleSearchClick, onClose]
  );

  const handleClearInput = useCallback(() => {
    handleInputChange("");
  }, [handleInputChange]);

  const handleCloseSuggestions = useCallback(() => {
    setIsSuggestionsVisible(false);
  }, [setIsSuggestionsVisible]);

  const handlePopularSearchClick = useCallback(
    (term: string) => {
      handleInputChange(term);
      handleSuggestionClick(term);
      onClose();
    },
    [handleInputChange, handleSuggestionClick, onClose]
  );

  const handleSuggestionClickWithClose = useCallback(
    (suggestion: string) => {
      handleSuggestionClick(suggestion);
      onClose();
    },
    [handleSuggestionClick, onClose]
  );

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close modal on outside click and prevent body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close suggestions when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsSuggestionsVisible(false);
    }
  }, [isOpen, setIsSuggestionsVisible]);

  // Wrap the original handleSearch so we can close the modal after searching
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        const res = handleSearch(e as any);
        await Promise.resolve(res);
      } catch (err) {
        // parent handler should surface errors via onSearchError; ignore here
      } finally {
        onClose();
      }
    },
    [handleSearch, onClose]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 bg-white z-50 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            {/* Compact Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Close search"
              >
                <MdKeyboardArrowLeft size={30} className="text-gray-600 text-lg" />
              </button>

              {/* Inline Search Bar */}
              <form
                id="mobile-search-form"
                onSubmit={handleFormSubmit}
                className="flex-1"
              >
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaSearch className="text-gray-400 text-sm" />
                  </div>

                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className={`
                      w-full pl-10 pr-10 py-2.5 text-sm rounded-md bg-gray-50 text-gray-900
                      placeholder:text-gray-500
                      focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      ${error ? "ring-2 ring-red-500" : ""}
                    `}
                    aria-label="Search input"
                  />

                  {/* Clear/Loading */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    ) : searchTerm ? (
                      <button
                        type="button"
                        onClick={handleClearInput}
                        className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Clear search"
                      >
                        <FaTimes className="text-gray-500 text-xs" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </form>
              {/* Search */}
              <Button label="Search" styles="text-orange-500 text-sm font-medium" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 pt-3">
                <ErrorMessage error={error} />
              </div>
            )}

            {/* Content Area */}
            <div className="px-4 pb-4">
              {/* Search Suggestions */}
              {isSuggestionsVisible && searchTerm && (
                <div className="pt-2">
                  <SearchSuggestions
                    query={searchTerm}
                    isVisible={isSuggestionsVisible}
                    onSuggestionClick={handleSuggestionClickWithClose}
                    onClose={handleCloseSuggestions}
                    className="rounded-lg"
                    maxSuggestions={8}
                  />
                </div>
              )}

              {/* Popular Searches */}
              {!searchTerm && getData && getData.length > 0 && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <FaFire className="text-orange-500 text-base" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Trending Now
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {getData.map((term: string) => (
                      <button
                        key={term}
                        onClick={() => handlePopularSearchClick(term)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 active:bg-orange-100 rounded-full transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches (placeholder) */}
              {!searchTerm && (!getData || getData.length === 0) && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400 text-base" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Recent Searches
                    </h3>
                  </div>

                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
                      <FaSearch className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Your recent searches will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(MobileSearchModal);

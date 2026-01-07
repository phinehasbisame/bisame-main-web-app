"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { dashboardOptions } from "./constants";
import { VscMenu, VscClose } from "react-icons/vsc";

const MobileDashboardOptions = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-up Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Quick access to all features
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <VscClose className="text-xl text-gray-600" />
              </button>
            </div>

            {/* Scrollable Menu Options */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {dashboardOptions.map(
                ({ id, option, description, href, icon }, index) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.2 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 transition-all"
                    >
                      {/* Icon container */}
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-400 group-hover:bg-orange-100 transition-colors flex-shrink-0">
                        {icon}
                      </div>

                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {option}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {description}
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                )
              )}

              {/* Bottom padding for safe area */}
              <div className="h-4" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isOpen ? (
            <VscClose size={20} />
          ) : (
            <VscMenu size={15} />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default MobileDashboardOptions;

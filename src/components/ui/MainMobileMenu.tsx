"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mainOptions } from "@/app/components/Dashboard/constants";
import { VscMenu, VscClose } from "react-icons/vsc";

const MainMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed bottom-0 left-0 right-0 z-[70]
          bg-white rounded-t-3xl shadow-2xl
          max-h-[88vh] flex flex-col
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <p className="text-xs text-gray-500">
              Manage your app activities here
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <VscClose className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {mainOptions.map(({ id, option, description, href, icon }) => (
            <Link
              key={id}
              href={href}
              onClick={() => setIsOpen(false)}
              className="
                  flex items-center gap-4
                  p-4 rounded-2xl
                  bg-white border border-gray-200
                  hover:bg-gray-50 active:bg-gray-100
                "
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 flex-shrink-0">
                {icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {option}
                </p>
                <p className="text-xs text-gray-500 truncate">{description}</p>
              </div>

              {/* Arrow */}
              <svg
                className="h-5 w-5 text-gray-400"
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
          ))}
        </nav>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed bottom-6 right-4 z-[99]
          flex h-11 w-11 items-center justify-center
          rounded-full bg-orange-500 text-white
          shadow-xl active:scale-95
        "
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <VscClose size={20} /> : <VscMenu size={16} />}
      </button>
    </div>
  );
};

export default MainMobileMenu;

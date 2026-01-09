"use client";

import { useState } from "react";
import Link from "next/link";
import { useBuySellData } from "../BuySellMenu/useBuySellData"; 
import { CategoryListSkeleton, FinalColumnSkeleton } from "./CategoryListSkeleton";

interface SubCategory {
  id: string;
  category: string;
}

interface Category {
  id: string;
  category: string;
  group: string;
  subCategories: SubCategory[];
}

const GROUPS = [
  "Services",
  "Buy and Sell",
  "Books",
  "Jobs",
  "Food",
  "Job Seekers",
  "Health",
];

const PANEL_HEIGHT = "h-[440px]";

const CategoriesMegaPanel = ({ onClose }: { onClose: () => void }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { categoriesData, isLoading } = useBuySellData(selectedGroup ?? "");

  return (
    <div className="w-[900px] bg-white shadow-md border border-neutral-100 rounded-lg grid grid-cols-3 overflow-hidden">
      <aside
        className={`border-r border-neutral-200 ${PANEL_HEIGHT} overflow-y-auto`}
      >
        <ul className="p-2 space-y-1">
          {GROUPS.map((group) => (
            <li
              key={group}
              onClick={() => {
                setSelectedGroup(group);
                setSelectedCategory(null);
              }}
              className={`
                px-3 py-2 rounded-md text-sm cursor-pointer
                ${
                  selectedGroup === group
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-50"
                }
              `}
            >
              {group}
            </li>
          ))}
        </ul>
      </aside>

      <section
        className={`border-r border-neutral-200 ${PANEL_HEIGHT} overflow-y-auto`}
      >
        {isLoading && <CategoryListSkeleton />}

        {!isLoading && (
          <div className="p-2 space-y-1">
            {categoriesData?.map((category: Category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 py-2 rounded-md text-sm cursor-pointer
                  ${
                    selectedCategory?.id === category.id
                      ? "bg-neutral-100 text-neutral-900"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }
                `}
              >
                {category.category}
              </div>
            ))}

            {!categoriesData?.length && (
              <p className="px-3 py-2 text-sm text-neutral-500">
                No categories available
              </p>
            )}
          </div>
        )}
      </section>

      <section className={`${PANEL_HEIGHT} overflow-y-auto`}>
        {isLoading && <FinalColumnSkeleton />}

        {!isLoading && !selectedCategory && (
          <div className="p-4 text-sm text-neutral-500">
            Select a category to continue
          </div>
        )}

        {!isLoading && selectedCategory && (
          <div className="p-4 space-y-1">
            <Link
              href={`/SearchPage?categoryGroup=${encodeURIComponent(
                selectedCategory.group
              )}&category=${encodeURIComponent(selectedCategory.category)}`}
              onClick={onClose}
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-neutral-100"
            >
              All {selectedCategory.category}
            </Link>

            {selectedCategory.subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/SearchPage?categoryGroup=${encodeURIComponent(
                  selectedCategory.group
                )}&category=${encodeURIComponent(
                  selectedCategory.category
                )}&subCategory=${encodeURIComponent(sub.category)}`}
                onClick={onClose}
                className="block px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-50"
              >
                {sub.category}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoriesMegaPanel;

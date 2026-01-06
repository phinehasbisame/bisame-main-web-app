
import { ServiceCategorySelector } from "@/app/components/PostAd/ServiceCategorySelector/ServiceCategorySelector";
import type { ServiceSelection } from "@/app/components/PostAd/ServiceCategorySelector/useServiceSelector";
import { EditServiceCategorySelector } from "../EditServiceCategorySelectory";

export type Group =
  | "services"
  | "Services"
  | "products"
  | "Buy and Sell"
  | "books"
  | "Books"
  | "jobs"
  | "Jobs"
  | "foods"
  | "Food"
  | "Foods"
  | "jobseek"
  | "Job Seekers"
  | "health"
  | "Health";

export interface HandleGroupInputProps {
  onServiceSelect: (selection: ServiceSelection) => void;
  selectedService?: ServiceSelection | null;
  className?: string;
  placeholder?: string;
}

export const handleEditGroupInput = (
  group: Group,
  props: HandleGroupInputProps
) => {
  switch (group) {
    case "services":
    case "Services":
      return <EditServiceCategorySelector {...props} group="Services" />;

    case "products":
    case "Buy and Sell":
      return (
        <EditServiceCategorySelector
          placeholder="Select a product..."
          group="Buy and Sell"
          {...props}
        />
      );

    case "books":
    case "Books":
      return (
        <EditServiceCategorySelector
          group="Books"
          placeholder="Select a book you would like to post..."
          {...props}
        />
      );

    case "jobs":
    case "Jobs":
      return (
        <EditServiceCategorySelector
          group="Jobs"
          placeholder="Select a job you want to post..."
          {...props}
        />
      );

    case "foods":
    case "Food":
    case "Foods":
      return (
        <EditServiceCategorySelector
          group="Food"
          placeholder="Select food you want to post..."
          {...props}
        />
      );

    case "jobseek":
    case "Job Seekers":
      return (
        <EditServiceCategorySelector
          group="Job Seekers"
          placeholder="Select a job you are looking for..."
          {...props}
        />
      );

    case "health":
    case "Health":
      return (
        <EditServiceCategorySelector
          group="Health"
          placeholder="Select a health category you want to post..."
          {...props}
        />
      );

    default:
      return null;
  }
};

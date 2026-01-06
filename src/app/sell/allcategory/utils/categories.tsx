import { ServiceCategorySelector } from "@/app/components/PostAd/ServiceCategorySelector/ServiceCategorySelector";
import type { ServiceSelection } from "@/app/components/PostAd/ServiceCategorySelector/useServiceSelector";

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

export const handleGroupInput = (
  group: Group,
  props: HandleGroupInputProps
) => {
  switch (group) {
    case "services":
    case "Services":
      return <ServiceCategorySelector {...props} group="Services" />;

    case "products":
    case "Buy and Sell":
      return (
        <ServiceCategorySelector
          placeholder="Select a product..."
          group="Buy and Sell"
          {...props}
        />
      );

    case "books":
    case "Books":
      return (
        <ServiceCategorySelector
          group="Books"
          placeholder="Select a book you would like to post..."
          {...props}
        />
      );

    case "jobs":
    case "Jobs":
      return (
        <ServiceCategorySelector
          group="Jobs"
          placeholder="Select a job you want to post..."
          {...props}
        />
      );

    case "foods":
    case "Food":
      return (
        <ServiceCategorySelector
          group="Foods"
          placeholder="Select food you want to post..."
          {...props}
        />
      );

    case "jobseek":
    case "Job Seekers":
      return (
        <ServiceCategorySelector
          group="Job Seekers"
          placeholder="Select a job you are looking for..."
          {...props}
        />
      );

    case "health":
    case "Health":
      return (
        <ServiceCategorySelector
          group="Health"
          placeholder="Select a health category you want to post..."
          {...props}
        />
      );

    default:
      return null;
  }
};

import ProductDetail from "@/app/components/ProductDetails/ProductDetail";
import ProductInformation from "@/app/components/ProductDetails/ProductInformation";
import RelatedProducts from "@/app/components/ProductDetails/RelatedProducts/RelatedProducts";
import { Suspense } from "react";
import { BottomNavigation } from "../components/BottomNavigation";
import Loader from "../components/Loader/Loader";
import MainMobileMenu from "@/components/ui/MainMobileMenu";

const ProductPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ProductDetail />
      <ProductInformation />
      <RelatedProducts />
      {/* <BottomNavigation /> */}
       <MainMobileMenu />
    </Suspense>
  );
};

export default ProductPage;

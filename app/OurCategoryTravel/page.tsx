import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Automotive from "@/components/Automotive";
import Bannerimg from "@/components/Bannerimg";
import Bannermain from "@/components/Bannermain";
import HeroBanner from "@/components/HeroBanner";
import OurCategory from "@/components/OurCategory";
import OurCategoryTravel from "@/components/OurCategoryTravel";

export const metadata: Metadata = {
  title: "ksa4sale | Admin Dashboard OurCategoryTravel",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const OurCategoryTravelpage = () => {
  return (
    <DefaultLayout>
      <OurCategoryTravel />
    </DefaultLayout>
  );
};

export default OurCategoryTravelpage;

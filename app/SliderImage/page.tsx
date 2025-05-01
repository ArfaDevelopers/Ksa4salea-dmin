import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import RealEstate from "@/components/RealEstate";
import PETANIMALCOMP from "@/components/PETANIMALCOMP";
import Profile from "@/components/Profile";
import SliderImage from "@/components/SliderImage";

export const metadata: Metadata = {
  title: "ksa4sale | Admin Dashboard SliderImage",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const SliderImagepage = () => {
  return (
    <DefaultLayout>
      <SliderImage />
    </DefaultLayout>
  );
};

export default SliderImagepage;

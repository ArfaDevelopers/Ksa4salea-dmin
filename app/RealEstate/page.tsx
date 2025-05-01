import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import RealEstate from "@/components/RealEstate";

export const metadata: Metadata = {
  title: "ksa4sale | Admin Dashboard RealEstate",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const RealEstatePage = () => {
  return (
    <DefaultLayout>
      <RealEstate />
    </DefaultLayout>
  );
};

export default RealEstatePage;

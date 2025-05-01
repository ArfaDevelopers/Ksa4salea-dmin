import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import RealEstate from "@/components/RealEstate";
import REALESTATECOMP from "@/components/REALESTATECOMP";

export const metadata: Metadata = {
  title: "ksa4sale | Admin Dashboard REALESTATECOMP",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const REALESTATECOMPPage = () => {
  return (
    <DefaultLayout>
      <REALESTATECOMP />
    </DefaultLayout>
  );
};

export default REALESTATECOMPPage;

import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import RealEstate from "@/components/RealEstate";
import REALESTATECOMP from "@/components/REALESTATECOMP";
import SPORTSGAMESComp from "@/components/SPORTSGAMESComp";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard SPORTSGAMESComp",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const SPORTSGAMESCompPage = () => {
  return (
    <DefaultLayout>
      <SPORTSGAMESComp />
    </DefaultLayout>
  );
};

export default SPORTSGAMESCompPage;

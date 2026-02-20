import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import RealEstate from "@/components/RealEstate";
import REALESTATECOMP from "@/components/REALESTATECOMP";
import TRAVEL from "@/components/TRAVEL";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard TRAVEL",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const TRAVELpage = () => {
  return (
    <DefaultLayout>
      <TRAVEL />
    </DefaultLayout>
  );
};

export default TRAVELpage;

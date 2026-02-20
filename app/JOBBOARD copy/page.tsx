import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Cars from "@/components/Cars";
import Bikes from "@/components/Bikes";
import JOBBOARDPage from "@/components/JOBBOARDPage";
import AboutUs from "@/components/AboutUs";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard AboutUs",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const JOBBOARD = () => {
  return (
    <DefaultLayout>
      <AboutUs />
    </DefaultLayout>
  );
};

export default JOBBOARD;

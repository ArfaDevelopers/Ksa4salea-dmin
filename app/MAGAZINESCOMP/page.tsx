import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Cars from "@/components/Cars";
import Bikes from "@/components/Bikes";
import JOBBOARDPage from "@/components/JOBBOARDPage";
import MAGAZINESCOMP from "@/components/MAGAZINESCOMP";


export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const MAGAZINESCOMPPAGE = () => {
  return (
    <DefaultLayout>
      <MAGAZINESCOMP />
    </DefaultLayout>
  );
};

export default MAGAZINESCOMPPAGE;

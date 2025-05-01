import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Cars from "@/components/Cars";
import Bikes from "@/components/Bikes";
import JOBBOARDPage from "@/components/JOBBOARDPage";
import Reported from "@/components/Reported";

export const metadata: Metadata = {
  title: "ksa4sale | Admin Dashboard Reported",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const Reportedpage = () => {
  return (
    <DefaultLayout>
      <Reported />
    </DefaultLayout>
  );
};

export default Reportedpage;

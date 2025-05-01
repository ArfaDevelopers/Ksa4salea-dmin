import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Cars from "@/components/Cars";
import ElectronicComp from "@/components/ElectronicComp";

export const metadata: Metadata = {
  title: "ksa4sale | Admin Dashboard Electronic",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const ElectronicCompPage = () => {
  return (
    <DefaultLayout>
      <ElectronicComp />
    </DefaultLayout>
  );
};

export default ElectronicCompPage;

import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Automotive from "@/components/Automotive";
import Bannerimg from "@/components/Bannerimg";
import Bannermain from "@/components/Bannermain";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard Bannermain",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const Bannermainpage = () => {
  return (
    <DefaultLayout>
      <Bannermain />
    </DefaultLayout>
  );
};

export default Bannermainpage;

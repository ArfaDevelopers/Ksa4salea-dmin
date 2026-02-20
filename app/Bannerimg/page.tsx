import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Automotive from "@/components/Automotive";
import Bannerimg from "@/components/Bannerimg";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard Bannerimg",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const Bannerimgpage = () => {
  return (
    <DefaultLayout>
      <Bannerimg />
    </DefaultLayout>
  );
};

export default Bannerimgpage;

import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Automotive from "@/components/Automotive";
import AboutUs from "@/components/AboutUs";
import BodyContent from "@/components/BodyContent";
import ServicesContent from "@/components/ServicesContent";

export const metadata: Metadata = {
  title: "ksa4sale | Admin Dashboard Cars",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const ServicesContentpage = () => {
  return (
    <DefaultLayout>
      <ServicesContent />
    </DefaultLayout>
  );
};

export default ServicesContentpage;

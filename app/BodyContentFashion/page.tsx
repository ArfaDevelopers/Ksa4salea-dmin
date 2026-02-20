import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Automotive from "@/components/Automotive";
import AboutUs from "@/components/AboutUs";
import BodyContent from "@/components/BodyContent";
import BodyContentFashion from "@/components/BodyContentFashion";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard Cars",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const BodyContentFashionpage = () => {
  return (
    <DefaultLayout>
      <BodyContentFashion />
    </DefaultLayout>
  );
};

export default BodyContentFashionpage;

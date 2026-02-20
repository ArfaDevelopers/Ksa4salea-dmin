import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import HomeFurnitureContent from "@/components/HomeFurnitureContent";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard Cars",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const HomeFurnitureContentpage = () => {
  return (
    <DefaultLayout>
      <HomeFurnitureContent />
    </DefaultLayout>
  );
};

export default HomeFurnitureContentpage;

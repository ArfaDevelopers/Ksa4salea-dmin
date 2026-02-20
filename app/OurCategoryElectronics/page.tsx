import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Electronic from "@/components/Electronic";
import OurCategoryElectronics from "@/components/OurCategoryElectronics";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard OurCategoryElectronics",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const OurCategoryElectronicsPage = () => {
  return (
    <DefaultLayout>
      <OurCategoryElectronics />
    </DefaultLayout>
  );
};

export default OurCategoryElectronicsPage;

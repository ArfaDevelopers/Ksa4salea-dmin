import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Electronic from "@/components/Electronic";
import OurCategoryFashionStyle from "@/components/OurCategoryFashionStyle";

export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const OurCategoryFashionStylePage = () => {
  return (
    <DefaultLayout>
      <OurCategoryFashionStyle />
    </DefaultLayout>
  );
};

export default OurCategoryFashionStylePage;

import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Cars from "@/components/Cars";
import ElectronicComp from "@/components/ElectronicComp";
import FashionStyle from "@/components/FashionStyle";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard FashionStyle",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const FashionStylePage = () => {
  return (
    <DefaultLayout>
      <FashionStyle />
    </DefaultLayout>
  );
};

export default FashionStylePage;

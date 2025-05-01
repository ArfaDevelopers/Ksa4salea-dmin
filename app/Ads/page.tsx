import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";

export const metadata: Metadata = {
  title: "ksa4sale | Admin Dashboard AdsPage",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const AdsPage = () => {
  return (
    <DefaultLayout>
      <Ads />
    </DefaultLayout>
  );
};

export default AdsPage;

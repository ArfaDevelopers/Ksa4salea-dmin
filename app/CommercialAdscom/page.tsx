import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Cars from "@/components/Cars";
import CommercialAdscom from "@/components/CommercialAdscom";

export const metadata: Metadata = {
  title: "k | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const CommercialAdscomPage = () => {
  return (
    <DefaultLayout>
      <CommercialAdscom />
    </DefaultLayout>
  );
};

export default CommercialAdscomPage;

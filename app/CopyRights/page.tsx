import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Automotive from "@/components/Automotive";
import CopyRights from "@/components/CopyRights";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard Cars",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const CopyRightspage = () => {
  return (
    <DefaultLayout>
      <CopyRights />
    </DefaultLayout>
  );
};

export default CopyRightspage;

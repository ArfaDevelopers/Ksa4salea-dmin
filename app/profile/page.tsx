import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import RealEstate from "@/components/RealEstate";
import PETANIMALCOMP from "@/components/PETANIMALCOMP";
import Profile from "@/components/Profile";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard Profile",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const Profilepage = () => {
  return (
    <DefaultLayout>
      <Profile />
    </DefaultLayout>
  );
};

export default Profilepage;

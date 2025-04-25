import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import RealEstate from "@/components/RealEstate";
import PETANIMALCOMP from "@/components/PETANIMALCOMP";
import Profile from "@/components/Profile";
import Users from "@/components/Users";

export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const Userspage = () => {
  return (
    <DefaultLayout>
      <Users />
    </DefaultLayout>
  );
};

export default Userspage;

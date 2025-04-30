import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";
import Ads from "@/components/Ads";
import Cars from "@/components/Cars";
import ElectronicComp from "@/components/ElectronicComp";
import FashionStyle from "@/components/FashionStyle";
import UserListing from "@/components/UserListing";

export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const UserListingPage = () => {
  return (
    <DefaultLayout>
      <UserListing />
    </DefaultLayout>
  );
};

export default UserListingPage;

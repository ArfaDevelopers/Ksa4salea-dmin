import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Healthcare from "@/components/Healthcare";

export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const HealthcarePage = () => {
  return (
    <DefaultLayout>
      <Healthcare />
    </DefaultLayout>
  );
};

export default HealthcarePage;

import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Categories from "@/components/Categories";

export const metadata: Metadata = {
  title: "ksa4sale | Admin Dashboard Categories",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const CalendarPage = () => {
  return (
    <DefaultLayout>
      <Categories />
    </DefaultLayout>
  );
};

export default CalendarPage;

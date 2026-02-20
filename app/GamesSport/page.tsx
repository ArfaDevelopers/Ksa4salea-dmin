import Calendar from "@/components/Categories";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import GamesSport from "@/components/GamesSport";

export const metadata: Metadata = {
  title: "Mazhool | Admin Dashboard GamesSport",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const GamesSportPage = () => {
  return (
    <DefaultLayout>
      <GamesSport />
    </DefaultLayout>
  );
};

export default GamesSportPage;

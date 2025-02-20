import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopicsCard";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";
import { getAuthSession } from "@/lib/nexthauth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Dashboard | AI Quiz",
  description: "Quiz yourself on anything!",
};

const Dashboard = async () => {
  const session = await getAuthSession();
  if (!session) {
    redirect("/");
  }

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="grid md:grid-cols-2 gap-5">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Lỗi document not define */}
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  );
};

export default Dashboard;

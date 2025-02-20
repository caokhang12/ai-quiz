import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

const RecentActivityCard = () => {
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>
          {/* You have played a total of {games_count} quizzes. */}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        {/* <HistoryComponent limit={10} userId={session.user.id} /> */}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;

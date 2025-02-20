import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/nexthauth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex items-center justify-center py-2 translate-y-1/2">
      <Card className="w-96 ">
        <CardHeader className="flex items-center ">
          <CardTitle className="text-2xl">AI Quiz</CardTitle>
          <CardDescription className="text-center">
            {" "}
            AI Quiz is a platform for creating quizzes using AI!. Get started by
            logging in below!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center mt-8">
          <SignInButton text="Sign In with Google" />
        </CardContent>
      </Card>
    </div>
  );
}

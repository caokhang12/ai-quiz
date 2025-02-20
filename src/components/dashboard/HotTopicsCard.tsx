import CustomWordCloud from "@/components/CustomWordCloud";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const HotTopicsCard = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
       <CustomWordCloud />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;

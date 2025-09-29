import { Card, CardContent, CardAction } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPen } from "lucide-react";

const CampaignCard = ({ campaign }) => {
  const { media, title, description, goalAmount, raisedAmount, createdBy } =
    campaign;

  return (
    <Card className="shadow-md hover:shadow-lg transition pt-0 rounded-md">
      <img
        src={media[0]}
        alt={title}
        className="w-full h-[180px] object-fill rounded-md"
        loading="eager"
      />
      <CardContent>
        <h3 className="text-lg font-semibold line-clamp-1 capitalize">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex justify-between font-medium mt-2 text-muted-foreground">
          <span>Goal: ₹{goalAmount?.toLocaleString()}</span>
          <span>Raised: ₹{raisedAmount?.toLocaleString() || 0}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-2 mb-3.5 overflow-hidden">
          <div
            className="h-2 bg-emerald-500"
            style={{
              width: `${Math.min(
                ((raisedAmount || 0) / goalAmount) * 100,
                100
              )}`,
            }}
          />
        </div>

        <div className="bg-gray-50 p-1.5 rounded-full text-sm flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarFallback>
              <UserPen size={15} className="text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span>by: {createdBy?._id}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;

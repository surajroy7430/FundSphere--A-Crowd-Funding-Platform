import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/use-fetch";
import { Card, CardContent, CardAction } from "@/components/ui/card";
import CampaignCard from "../../components/campaign/CampaignCard";

const Dashboard = () => {
  const { request } = useFetch();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const res = await request({
        url: "/api/campaigns/published",
        showToast: false,
      });

      setCampaigns(res.data?.campaigns || []);
    };

    fetchCampaigns();
  }, []);

  if (!campaigns.length) return <div className="p-4">No Campaigns found</div>;

  return (
    <div className="p-4">
      <div className="text-2xl font-medium mb-6">Published Campaigns 🚀</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

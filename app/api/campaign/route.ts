import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.INSTANTLY_API_KEY;
  const campaignId = process.env.INSTANTLY_CAMPAIGN_ID;
  if (!apiKey || !campaignId) {
    return NextResponse.json(
      { error: "Missing API key or campaign ID" },
      { status: 500 }
    );
  }

  // Fetch campaign details
  let campaignDetails = null;
  try {
    const detailsRes = await fetch(
      `https://api.instantly.ai/api/v2/campaigns/${campaignId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      }
    );
    if (detailsRes.ok) {
      campaignDetails = await detailsRes.json();
    } else {
      console.error("Error fetching campaign details");
    }
  } catch (error) {
    console.error("Error fetching campaign details:", error);
  }

  // Prepare dates for analytics call
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // Fetch campaign analytics
  let campaignAnalytics = null;
  try {
    const analyticsRes = await fetch(
      `https://api.instantly.ai/api/v2/campaigns/analytics?id=${campaignId}&start_date=${formatDate(
        startDate
      )}&end_date=${formatDate(endDate)}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      }
    );
    if (analyticsRes.ok) {
      const analytics = await analyticsRes.json();
      if (Array.isArray(analytics) && analytics.length > 0) {
        campaignAnalytics = analytics[0];
      }
    } else {
      console.error("Error fetching campaign analytics");
    }
  } catch (error) {
    console.error("Error fetching campaign analytics:", error);
  }

  // Extract total leads from the analytics data
  const totalLeads = campaignAnalytics?.leads_count ?? 0;

  return NextResponse.json({
    campaignDetails,
    campaignAnalytics,
    totalLeads,
  });
}

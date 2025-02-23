// app/page.tsx
import React from "react";
import FunnelChart from "@/components/FunnelChart";
import EngagementDistribution from "@/components/EngagementDistribution";
import EmailCard from "@/components/EmailCard";

interface CampaignDetails {
  name?: string;
  pl_value?: number;
  campaign_schedule?: {
    start_date?: string;
    schedules?: Array<{
      timing?: { from?: string; to?: string };
      days?: { [key: string]: boolean };
    }>;
  };
}

interface CampaignAnalytics {
  leads_count?: number;
  contacted_count?: number;
  open_count?: number;
  reply_count?: number;
  emails_sent_count?: number;
  bounced_count?: number;
  completed_count?: number;
}

interface CampaignData {
  campaignDetails: CampaignDetails | null;
  campaignAnalytics: CampaignAnalytics | null;
  // totalLeads is still provided from the API, but we won't use it
  totalLeads: number;
}

async function getCampaignData(): Promise<CampaignData> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/campaign`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch campaign data");
  }
  return res.json();
}

export default async function Page() {
  // Destructure totalLeads even if we won't use it, or remove it if not needed
  const { campaignDetails, campaignAnalytics } = await getCampaignData();

  // Campaign title and details
  const campaignName = campaignDetails?.name || "Campaign Results";

  // Schedule Details
  let formattedStartDate = "N/A";
  let scheduleStr = "Schedule not available";
  if (campaignDetails?.campaign_schedule) {
    const schedule = campaignDetails.campaign_schedule;
    if (schedule.start_date) {
      const startDateObj = new Date(schedule.start_date);
      formattedStartDate = startDateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    if (schedule.schedules && schedule.schedules.length > 0) {
      const firstSchedule = schedule.schedules[0];
      const timing = firstSchedule.timing || {};
      const timeFrom = timing.from || "N/A";
      const timeTo = timing.to || "N/A";
      const days = firstSchedule.days || {};
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const activeDays = Object.keys(days)
        .filter((k) => days[k])
        .map((k) => dayNames[parseInt(k)])
        .join(" ");
      scheduleStr = `From ${timeFrom} to ${timeTo} on ${activeDays}`;
    }
  }

  // Campaign Performance Metrics
  // Hard-code Total Leads to 100 instead of using totalLeads from the API
  const hardCodedTotalLeads = 100;
  const emailsSent = campaignAnalytics?.emails_sent_count ?? 0;
  const replies = campaignAnalytics?.reply_count ?? 0;
  const replyRate = emailsSent > 0 ? (replies / emailsSent) * 100 : 0;

  // Progress calculation based on completed_count vs. leads_count (from campaignAnalytics)
  const progress =
    campaignAnalytics && campaignAnalytics.leads_count
      ? (campaignAnalytics.completed_count || 0) / campaignAnalytics.leads_count
      : 0;
  const progressPercent = Math.round(progress * 100);

  return (
    <main className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {campaignName}
      </h1>

      {/* Campaign Type and Schedule Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-700">Campaign type:</span>
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png"
            alt="Gmail"
            className="w-6 h-6"
          />
          <span className="text-gray-700">+</span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png"
            alt="LinkedIn"
            className="w-6 h-6"
          />
        </div>
        <div className="text-gray-700">
          <strong className="font-semibold">⏰ Schedule:</strong> {scheduleStr}
        </div>
        <div className="text-gray-700">
          <strong className="font-semibold">🏁 Start Date:</strong>{" "}
          {formattedStartDate}
        </div>
      </div>

      {/* Campaign Performance Metrics */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Campaign Performance for Batch 1
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 border-l-4 border-blue-500">
          <div className="text-gray-700">Total Leads</div>
          <div className="text-3xl font-bold text-blue-500">
            {hardCodedTotalLeads}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 border-l-4 border-blue-500">
          <div className="text-gray-700">Emails Sent</div>
          <div className="text-3xl font-bold text-blue-500">{emailsSent}</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 border-l-4 border-blue-500">
          <div className="text-gray-700">Replies</div>
          <div className="text-3xl font-bold text-blue-500">{replies}</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 border-l-4 border-blue-500">
          <div className="text-gray-700">Reply Rate</div>
          <div className="text-3xl font-bold text-blue-500">
            {replyRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Campaign Progress Bar */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Campaign Sequence Progress
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <p className="text-gray-700 font-semibold mb-6">
        {progressPercent}% Complete
      </p>

      {/* Campaign Sequence - Emails */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Campaign Sequence
      </h2>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Step 1 - Email Variants
      </h3>

      {/* Variant 1 */}
      <h4 className="text-lg font-semibold text-gray-800 mb-2">
        Variant 1
      </h4>
      <EmailCard
        subject="Can we help you speed access to User and Customer insights?"
        body={`<div>Hi {{firstName}},<br><br></div>
               <div>I found you on LinkedIn, value your role, and thought I’d reach out.<br><br></div>
               <div>Our company, trustMinder, supports you with a solution that engages, understands and surfaces insights from your customers in real time.<br><br></div>
               <div>Interested in a quick 15-minute call to learn more?</div>`}
      />

      {/* Variant 2 */}
      <h4 className="text-lg font-semibold text-gray-800 mb-2">
        Variant 2
      </h4>
      <EmailCard
        subject="15 Minutes to Level-up Your CX/UX Efforts"
        body={`<div>Hi {{firstName}},</div>
               <div><br></div>
               <div>I’m from trustMinder, and we help CX and UX pros get immediate, actionable insights—without the usual complexity. If you’re juggling multiple vendors or waiting too long for data, we make it easy.</div>
               <div><br></div>
               <div>Could we hop on a quick 15-minute call to explore how trustMinder can simplify your work?</div>
               <div><br></div>`}
      />

      {/* Variant 3 */}
      <h4 className="text-lg font-semibold text-gray-800 mb-2">
        Variant 3
      </h4>
      <EmailCard
        subject="Level Up Your CX/UX, Fast"
        body={`<div>Hi {{firstName}},</div>
               <div><br></div>
               <div>I’m reaching out from trustMinder because I think we can help uncover fresh opportunities in your CX and UX initiatives. I found you on LinkedIn &amp; thought I’d reach out.</div>
               <div><br></div>
               <div>Our platform is designed to provide you with swift, actionable insights, so you spend less time sorting through data and more time driving changes that matter.</div>
               <div><br></div>
               <div>Could I show you on a 15-minute conversation?</div>
               <div><br></div>
               <div>Best,</div>`}
      />

      {/* Follow Up Email */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Follow Up Email
      </h3>
      <EmailCard
        subject=""
        body={`<div>Hi {{firstName}},<br><br></div>
               <div>Just checking back to see if a quick 15-minute conversation would help clarify how trustMinder can accelerate your CX and UX initiatives. We focus on making insights both immediate and actionable—because your time is valuable, and your customers won’t wait.<br><br></div>
               <div>Looking forward to hearing from you!</div>`}
        showSubject={false}
      />

      {/* Google Sheet Embed */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Leads (Google Sheet)
      </h2>
      <iframe
        src="https://docs.google.com/spreadsheets/d/1maOnPS4U41h-7s1rzMM1GJs8nxCD3mB3S7VJ2t5Etgg/edit?gid=771089435#gid=771089435"
        width="100%"
        height="600"
        frameBorder="0"
        className="border border-gray-300"
      ></iframe>

      {/* Engagement Charts */}
      {campaignAnalytics && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Campaign Engagement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FunnelChart data={campaignAnalytics} />
            </div>
            <div>
              <EngagementDistribution data={campaignAnalytics} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

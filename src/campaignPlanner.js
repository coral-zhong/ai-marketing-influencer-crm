const REQUIRED_CAMPAIGN_INPUTS = [
  ["brand", "Brand"],
  ["campaignGoal", "Campaign Goal"],
  ["creatorCriteria", "Creator Criteria"]
];

export function planCampaignTasks(campaign) {
  const missingInputs = REQUIRED_CAMPAIGN_INPUTS
    .filter(([field]) => !text(campaign[field]))
    .map(([, label]) => label);

  const readinessScore = Math.max(0, 100 - missingInputs.length * 20);
  if (missingInputs.length > 0) {
    return {
      readinessScore,
      status: "Needs campaign inputs",
      missingInputs,
      tasks: [
        {
          taskName: `Complete campaign context: ${text(campaign.campaignName) || "Untitled Campaign"}`,
          taskType: "complete_campaign_context",
          permissionLevel: "manual",
          inputRecordType: "Campaign",
          rationale: `Missing required inputs: ${missingInputs.join(", ")}.`
        }
      ],
      summary: `Campaign ${text(campaign.campaignName) || "Untitled Campaign"} needs ${missingInputs.length} input(s) before creator work should start.`
    };
  }

  const campaignName = text(campaign.campaignName) || `${campaign.brand} ${campaign.productName || "Campaign"}`;
  const creatorSegment = text(campaign.creatorCriteria);

  return {
    readinessScore,
    status: "Ready for creator search",
    missingInputs: [],
    tasks: [
      {
        taskName: `Find creators: ${campaignName}`,
        taskType: "creator_search_planner",
        permissionLevel: "review",
        inputRecordType: "Campaign",
        rationale: `Search for ${creatorSegment}.`
      },
      {
        taskName: `Screen creators: ${campaignName}`,
        taskType: "screen_creator",
        permissionLevel: "review",
        inputRecordType: "Creator",
        rationale: "Score captured creators against campaign criteria before outreach."
      },
      {
        taskName: `Draft outreach: ${campaignName}`,
        taskType: "draft_outreach",
        permissionLevel: "review",
        inputRecordType: "Creator",
        rationale: "Generate outreach drafts only after creator screening is reviewed."
      }
    ],
    summary: `${campaignName} is ready for creator search. Start by finding creators matching: ${creatorSegment}.`
  };
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}


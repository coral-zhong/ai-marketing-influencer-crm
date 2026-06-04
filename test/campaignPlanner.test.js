import test from "node:test";
import assert from "node:assert/strict";
import { planCampaignTasks } from "../src/campaignPlanner.js";

test("planCampaignTasks creates creator workflow tasks from campaign context", () => {
  const result = planCampaignTasks({
    campaignName: "Spring TikTok UGC Test",
    brand: "Demo Brand",
    productName: "Magnetic power bank",
    campaignGoal: "Find creators who can make short tutorial-style TikTok demos.",
    targetMarket: "US",
    creatorCriteria: "TikTok UGC review creators with clear product demos.",
    claimsAllowed: "Portable charger, magnetic attachment.",
    claimsToAvoid: "Guaranteed battery life."
  });

  assert.equal(result.readinessScore, 100);
  assert.equal(result.status, "Ready for creator search");
  assert.deepEqual(result.tasks.map((task) => task.taskType), [
    "creator_search_planner",
    "screen_creator",
    "draft_outreach"
  ]);
  assert.equal(result.tasks[0].permissionLevel, "review");
  assert.match(result.summary, /Spring TikTok UGC Test/);
});

test("planCampaignTasks reports missing campaign inputs", () => {
  const result = planCampaignTasks({
    campaignName: "Incomplete Campaign",
    productName: "Magnetic power bank"
  });

  assert.equal(result.readinessScore, 40);
  assert.equal(result.status, "Needs campaign inputs");
  assert.deepEqual(result.missingInputs, ["Brand", "Campaign Goal", "Creator Criteria"]);
  assert.equal(result.tasks.length, 1);
  assert.equal(result.tasks[0].taskType, "complete_campaign_context");
});


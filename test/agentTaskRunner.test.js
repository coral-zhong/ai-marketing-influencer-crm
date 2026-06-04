import assert from "node:assert/strict";
import test from "node:test";

import { runAgentTask } from "../src/agentTaskRunner.js";

test("runAgentTask handles campaign_plan tasks", () => {
  const result = runAgentTask({
    taskType: "campaign_plan",
    input: {
      campaign: {
        campaignName: "Spring TikTok UGC Test",
        brand: "Demo Brand",
        productName: "Magnetic power bank",
        campaignGoal: "Find creators for short tutorial demos",
        creatorCriteria: "TikTok UGC review creators"
      }
    }
  });

  assert.equal(result.status, "needs_review");
  assert.equal(result.taskType, "campaign_plan");
  assert.equal(result.output.tasks.length, 3);
  assert.match(result.outputSummary, /Campaign plan created/);
});

test("runAgentTask handles viral_breakdown tasks", () => {
  const result = runAgentTask({
    taskType: "viral_breakdown",
    input: {
      content: {
        title: "Magnetic power bank desk setup review",
        platform: "TikTok",
        publishedUrl: "https://example.com/video",
        transcript: "I stopped carrying three chargers. This magnetic power bank snaps on fast.",
        visualNotes: "Messy cables, snap-on demo, bag fit test."
      },
      campaign: {
        productName: "Magnetic power bank"
      }
    }
  });

  assert.equal(result.status, "needs_review");
  assert.equal(result.taskType, "viral_breakdown");
  assert.equal(result.output.breakdownStatus, "Ready For Review");
  assert.match(result.outputSummary, /Viral breakdown ready/);
});

test("runAgentTask rejects unsupported task types", () => {
  assert.throws(
    () => runAgentTask({ taskType: "unknown_task", input: {} }),
    /Unsupported agent task type/
  );
});

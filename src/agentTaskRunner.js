import { planCampaignTasks } from "./campaignPlanner.js";
import { breakDownViralContent } from "./viralBreakdown.js";

export function runAgentTask(task) {
  const taskType = task.taskType || task.type || "";
  const input = task.input || {};

  if (taskType === "campaign_plan") {
    const output = planCampaignTasks(input.campaign || input);
    return buildTaskResult({
      taskType,
      output,
      outputSummary: `Campaign plan created with ${output.tasks.length} recommended agent tasks.`
    });
  }

  if (taskType === "viral_breakdown") {
    const output = breakDownViralContent({
      content: input.content || {},
      campaign: input.campaign || {}
    });
    return buildTaskResult({
      taskType,
      output,
      outputSummary: output.breakdownStatus === "Ready For Review"
        ? `Viral breakdown ready: ${output.hook || "hook extracted"}.`
        : `Viral breakdown is ${output.breakdownStatus}.`
    });
  }

  throw new Error(`Unsupported agent task type: ${taskType}`);
}

function buildTaskResult({ taskType, output, outputSummary }) {
  return {
    taskType,
    status: "needs_review",
    permissionLevel: "review",
    outputSummary,
    output
  };
}

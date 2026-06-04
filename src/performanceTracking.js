export function trackPublishedPerformance(input) {
  const collaboration = input.collaboration || {};
  const publishedContent = input.publishedContent || {};
  const metrics = normalizeMetrics(publishedContent.metrics || {});

  if (!text(publishedContent.publishedUrl)) {
    return buildResult({
      collaboration,
      publishedContent,
      metrics,
      performanceStatus: "Needs Published URL",
      performanceTier: "Unknown",
      nextAction: "Ask the creator for the live post URL before performance tracking starts.",
      blockers: ["Published content URL is missing."]
    });
  }

  if (!hasMetrics(metrics)) {
    return buildResult({
      collaboration,
      publishedContent,
      metrics,
      performanceStatus: "Needs Metrics",
      performanceTier: "Unknown",
      nextAction: "Capture views, likes, comments, saves, and shares from the live post.",
      blockers: ["Performance metrics are missing."]
    });
  }

  const engagementRate = calculateEngagementRate(metrics);
  const enrichedMetrics = {
    ...metrics,
    engagementRate
  };
  const performanceTier = tierFromEngagementRate(engagementRate);

  return buildResult({
    collaboration,
    publishedContent,
    metrics: enrichedMetrics,
    performanceStatus: "Ready For Review",
    performanceTier,
    nextAction: "Review performance against campaign goals and decide whether to reuse the content or re-engage the creator.",
    blockers: []
  });
}

function buildResult({ collaboration, publishedContent, metrics, performanceStatus, performanceTier, nextAction, blockers }) {
  return {
    performanceStatus,
    performanceTier,
    nextAction,
    blockers,
    publishedUrl: text(publishedContent.publishedUrl),
    platform: text(publishedContent.platform) || "Unknown",
    metrics,
    summary: `${publishedContent.platform || "Published content"} for ${collaboration.collaborationName || "collaboration"} is ${performanceStatus}. ${nextAction}`
  };
}

function normalizeMetrics(metrics) {
  return {
    views: number(metrics.views),
    likes: number(metrics.likes),
    comments: number(metrics.comments),
    saves: number(metrics.saves),
    shares: number(metrics.shares)
  };
}

function hasMetrics(metrics) {
  return metrics.views > 0 || metrics.likes > 0 || metrics.comments > 0 || metrics.saves > 0 || metrics.shares > 0;
}

function calculateEngagementRate(metrics) {
  if (metrics.views <= 0) return 0;
  const engagements = metrics.likes + metrics.comments + metrics.saves + metrics.shares;
  return Math.round((engagements / metrics.views) * 10000) / 10000;
}

function tierFromEngagementRate(rate) {
  if (rate >= 0.08) return "Strong";
  if (rate >= 0.03) return "Promising";
  return "Needs Review";
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

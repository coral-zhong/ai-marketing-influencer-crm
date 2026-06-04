const PROFILE_URL_PATTERN = /https?:\/\/(?:www\.)?(?:tiktok\.com\/@[\w.-]+|youtube\.com\/@[\w.-]+|instagram\.com\/[\w.-]+|xiaohongshu\.com\/user\/profile\/[\w.-]+)/gi;

export function searchCreatorsFromWebsiteSources(input) {
  const campaign = input.campaign || {};
  const sources = Array.isArray(input.sources) ? input.sources : [];
  if (sources.length === 0) {
    return {
      candidates: [],
      duplicates: [],
      errors: [{ message: "At least one website source is required." }],
      summary: { sources: 0, candidates: 0, duplicates: 0, errors: 1 }
    };
  }

  const seen = new Set();
  const candidates = [];
  const duplicates = [];
  const errors = [];

  sources.forEach((source, sourceIndex) => {
    const text = [source.title, source.text].filter(Boolean).join("\n");
    const urls = Array.from(text.matchAll(PROFILE_URL_PATTERN)).map((match) => match[0]);
    if (urls.length === 0) {
      errors.push({ sourceIndex, sourceUrl: source.url || "", message: "No supported creator profile URL found." });
      return;
    }

    for (const profileUrl of urls) {
      const normalizedUrl = normalizeProfileUrl(profileUrl);
      if (seen.has(normalizedUrl)) {
        duplicates.push({ sourceIndex, sourceUrl: source.url || "", profileUrl: normalizedUrl });
        continue;
      }

      seen.add(normalizedUrl);
      candidates.push({
        name: inferCreatorName(text, normalizedUrl),
        platform: inferPlatform(normalizedUrl, campaign.platform),
        profileUrl: normalizedUrl,
        category: campaign.creatorCriteria || "Creator candidate",
        sourceUrl: source.url || "",
        reason: `Matched campaign criteria: ${campaign.creatorCriteria || "creator candidate"}.`
      });
    }
  });

  return {
    candidates,
    duplicates,
    errors,
    summary: {
      sources: sources.length,
      candidates: candidates.length,
      duplicates: duplicates.length,
      errors: errors.length
    }
  };
}

function inferCreatorName(text, profileUrl) {
  const profileIndex = text.indexOf(profileUrl);
  const beforeProfile = profileIndex >= 0 ? text.slice(0, profileIndex) : text;
  const candidate = beforeProfile
    .split(/\n|\.|Profile:/)
    .map((part) => part.trim())
    .filter(Boolean)
    .at(-1);

  if (candidate) return candidate.replace(/\s+-\s+.*$/, "").trim();

  const handle = profileUrl.split("/").at(-1) || "Creator";
  return handle.replace(/^@/, "").replace(/[._-]/g, " ");
}

function inferPlatform(profileUrl, fallback) {
  if (profileUrl.includes("tiktok.com")) return "TikTok";
  if (profileUrl.includes("youtube.com")) return "YouTube";
  if (profileUrl.includes("instagram.com")) return "Instagram";
  if (profileUrl.includes("xiaohongshu.com")) return "Xiaohongshu";
  return fallback || "Other";
}

function normalizeProfileUrl(profileUrl) {
  return profileUrl.replace(/\/+$/, "");
}


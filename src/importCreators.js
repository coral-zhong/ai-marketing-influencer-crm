const FIELD_ALIASES = {
  "Creator Name": ["Creator Name", "Name", "creator_name", "name", "Handle"],
  Platform: ["Platform", "platform"],
  "Profile URL": ["Profile URL", "Profile", "profile_url", "url", "URL"],
  "Example Video URL": ["Example Video URL", "Video URL", "example_video_url", "video_url"],
  Category: ["Category", "Niche", "category", "niche"],
  Notes: ["Notes", "notes", "Comment", "comment"]
};

export function importCreatorsFromCsv(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length === 0) return emptyResult();

  const headers = rows[0].map((header) => header.trim());
  const seenProfileUrls = new Set();
  const imported = [];
  const duplicates = [];
  const errors = [];

  rows.slice(1).forEach((row, rowIndex) => {
    const rowNumber = rowIndex + 2;
    if (row.every((cell) => cell.trim() === "")) return;

    const raw = Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() || ""]));
    const creator = normalizeCreator(raw);
    const missing = requiredMissing(creator);

    if (missing.length > 0) {
      errors.push({ rowNumber, missing, raw });
      return;
    }

    const profileKey = creator.profileUrl.toLowerCase();
    if (seenProfileUrls.has(profileKey)) {
      duplicates.push({ rowNumber, profileUrl: creator.profileUrl, raw });
      return;
    }

    seenProfileUrls.add(profileKey);
    imported.push(creator);
  });

  return {
    imported,
    duplicates,
    errors,
    summary: {
      totalRows: rows.length - 1,
      imported: imported.length,
      duplicates: duplicates.length,
      errors: errors.length
    }
  };
}

export function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const next = csvText[index + 1];

    if (char === "\"" && next === "\"") {
      cell += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);
  return rows.filter((item) => item.some((cellValue) => cellValue.trim() !== ""));
}

function normalizeCreator(raw) {
  return {
    name: valueFor(raw, "Creator Name"),
    platform: valueFor(raw, "Platform"),
    profileUrl: valueFor(raw, "Profile URL"),
    exampleVideoUrl: valueFor(raw, "Example Video URL"),
    category: valueFor(raw, "Category"),
    notes: valueFor(raw, "Notes"),
    status: "To Screen"
  };
}

function valueFor(raw, canonicalField) {
  const aliases = FIELD_ALIASES[canonicalField] || [canonicalField];
  for (const alias of aliases) {
    if (raw[alias]) return raw[alias].trim();
  }
  return "";
}

function requiredMissing(creator) {
  const missing = [];
  if (!creator.name) missing.push("Creator Name");
  if (!creator.platform) missing.push("Platform");
  if (!creator.profileUrl) missing.push("Profile URL");
  return missing;
}

function emptyResult() {
  return {
    imported: [],
    duplicates: [],
    errors: [],
    summary: { totalRows: 0, imported: 0, duplicates: 0, errors: 0 }
  };
}


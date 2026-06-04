export function parseEnvText(text) {
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    env[key] = unquoteEnvValue(rawValue);
  }
  return env;
}

export function upsertEnvValues(text, values) {
  const remaining = new Map(Object.entries(values));
  const lines = text.split(/\r?\n/).map((line) => {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
    if (!match || !remaining.has(match[1])) return line;

    const key = match[1];
    const value = remaining.get(key);
    remaining.delete(key);
    return `${key}=${escapeEnvValue(value)}`;
  });

  for (const [key, value] of remaining) {
    lines.push(`${key}=${escapeEnvValue(value)}`);
  }

  return lines.join("\n").replace(/\n*$/, "\n");
}

function unquoteEnvValue(value) {
  if (value.length >= 2 && value.startsWith("\"") && value.endsWith("\"")) {
    return value.slice(1, -1).replace(/\\"/g, "\"");
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }
  return value;
}

function escapeEnvValue(value) {
  const stringValue = String(value || "");
  if (!/[#\s"'\\]/.test(stringValue)) return stringValue;
  return `"${stringValue.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
}

import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.js";

test("loadConfig prefers Railway PORT over AGENT_PORT", () => {
  const config = loadConfig({
    PORT: "8080",
    AGENT_PORT: "3215"
  });

  assert.equal(config.port, 8080);
});

test("loadConfig falls back to AGENT_PORT for local installs", () => {
  const config = loadConfig({
    AGENT_PORT: "3215"
  });

  assert.equal(config.port, 3215);
});

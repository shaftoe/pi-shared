/**
 * Z.ai Custom Provider Extension
 *
 * Extends the built-in `zai` provider with the newly announced GLM-5.2 model
 * ahead of built-in support.
 *
 * Because `pi.registerProvider()` with a `models` array fully replaces the
 * models for a provider, this extension re-registers the existing built-in zai
 * models alongside the new one so nothing is lost. Auth is shared with the
 * built-in `zai` provider: the `ZAI_API_KEY` env var or the `zai` entry in
 * `~/.pi/agent/auth.json`.
 *
 * GLM-5.2 specs (per http://docs.z.ai/devpack/latest-model):
 *   - reasoning model
 *   - text input
 *   - 1,000,000 token context window
 *   - 131,072 max output tokens
 *   - cost: 0 (GLM Coding Plan subscription)
 *
 * Usage:
 *   ZAI_API_KEY=your-key pi -e ./extensions/zai.ts
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerProvider("zai", {
    name: "ZAI",
    baseUrl: "https://api.z.ai/api/coding/paas/v4",
    apiKey: "$ZAI_API_KEY",
    api: "openai-completions",
    models: [
      {
        id: "glm-4.5-air",
        name: "GLM-4.5-Air",
        reasoning: true,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 131072,
        maxTokens: 98304,
        compat: {
          supportsDeveloperRole: false,
          thinkingFormat: "zai",
        },
      },
      {
        id: "glm-4.7",
        name: "GLM-4.7",
        reasoning: true,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 204800,
        maxTokens: 131072,
        compat: {
          supportsDeveloperRole: false,
          thinkingFormat: "zai",
          zaiToolStream: true,
        },
      },
      {
        id: "glm-5-turbo",
        name: "GLM-5-Turbo",
        reasoning: true,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 200000,
        maxTokens: 131072,
        compat: {
          supportsDeveloperRole: false,
          thinkingFormat: "zai",
          zaiToolStream: true,
        },
      },
      {
        id: "glm-5.1",
        name: "GLM-5.1",
        reasoning: true,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 200000,
        maxTokens: 131072,
        compat: {
          supportsDeveloperRole: false,
          thinkingFormat: "zai",
          zaiToolStream: true,
        },
      },
      {
        id: "glm-5v-turbo",
        name: "GLM-5V-Turbo",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 200000,
        maxTokens: 131072,
        compat: {
          supportsDeveloperRole: false,
          thinkingFormat: "zai",
          zaiToolStream: true,
        },
      },
      // Newly announced GLM-5.2 — added ahead of built-in support.
      {
        id: "glm-5.2",
        name: "GLM-5.2",
        reasoning: true,
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1000000,
        maxTokens: 131072,
        compat: {
          supportsDeveloperRole: false,
          thinkingFormat: "zai",
          zaiToolStream: true,
        },
      },
    ],
  });
}

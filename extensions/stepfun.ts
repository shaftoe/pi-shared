/**
 * StepFun Custom Provider
 *
 * Registers StepFun (阶跃星辰) models via their OpenAI-compatible API.
 * Supports reasoning models (step-3.7-flash, step-3.5-flash) with
 * configurable reasoning effort levels.
 *
 * API docs: https://platform.stepfun.ai/docs/en/api-reference/chat/chat-completion-create
 *
 * Usage:
 *   STEP_API_KEY=your-key pi -e ./extensions/stepfun.ts
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerProvider("stepfun", {
    name: "StepFun",
    baseUrl: "https://api.stepfun.ai/v1",
    apiKey: "$STEP_API_KEY",
    api: "openai-completions",
    models: [
      {
        id: "step-3.7-flash",
        name: "Step 3.7 Flash",
        reasoning: true,
        input: ["text", "image"],
        cost: {
          input: 0.20,
          output: 1.15,
          cacheRead: 0.04,
          cacheWrite: 0.20,
        },
        contextWindow: 262144,
        maxTokens: 65536,
        thinkingLevelMap: {
          off: null,
          minimal: "low",
          low: "low",
          medium: "medium",
          high: "high",
          xhigh: null,
        },
        compat: {
          supportsDeveloperRole: false,
          supportsReasoningEffort: true,
        },
      },
      {
        id: "step-3.5-flash",
        name: "Step 3.5 Flash",
        reasoning: true,
        input: ["text", "image"],
        cost: {
          input: 0.10,
          output: 0.30,
          cacheRead: 0.02,
          cacheWrite: 0.10,
        },
        contextWindow: 262144,
        maxTokens: 65536,
        compat: {
          supportsDeveloperRole: false,
        },
      },
      {
        id: "step-3.5-flash-2603",
        name: "Step 3.5 Flash 2603",
        reasoning: true,
        input: ["text", "image"],
        cost: {
          input: 0.10,
          output: 0.30,
          cacheRead: 0.02,
          cacheWrite: 0.10,
        },
        contextWindow: 262144,
        maxTokens: 65536,
        compat: {
          supportsDeveloperRole: false,
        },
      },
    ],
  });
}

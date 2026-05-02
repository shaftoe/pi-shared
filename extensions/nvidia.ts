import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerProvider("nvidia", {
    baseUrl: "https://integrate.api.nvidia.com/v1",
    apiKey: "NVIDIA_API_KEY",
    api: "openai-completions",
    models: [
      {
        id: "minimaxai/minimax-m2.7",
        name: "MiniMax M2.7 (via NVIDIA)",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 128000,
        maxTokens: 8192,
      },
      {
        id: "mistralai/mistral-medium-3.5-128b",
        name: "Mistral Medium 3.5 128B (via NVIDIA)",
        reasoning: true,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 128000,
        maxTokens: 128000,
        // Mistral via NVIDIA only supports 'none' and 'high' for reasoning_effort.
        // Map pi thinking levels to API values; null hides unsupported levels.
        thinkingLevelMap: {
          off: null,
          minimal: "none",
          low: null,
          medium: null,
          high: "high",
          xhigh: null,
        },
        compat: {
          supportsDeveloperRole: false,
          supportsReasoningEffort: true,
        },
      },
    ],
  });
}

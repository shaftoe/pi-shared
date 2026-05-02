import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	pi.registerProvider("deepseek", {
		baseUrl: "https://api.deepseek.com",
		apiKey: "DEEPSEEK_API_KEY",
		api: "openai-completions",
		models: [
			{
				id: "deepseek-v4-pro",
				name: "DeepSeek V4 Pro",
				reasoning: true,
				input: ["text"],
				cost: { input: 1.74, output: 3.48, cacheRead: 0.145, cacheWrite: 0 },
				contextWindow: 1000000,
				maxTokens: 384000,
				thinkingLevelMap: {
					off: null,
					minimal: null,
					low: "low",
					medium: "medium",
					high: "high",
					xhigh: "max",
				},
				compat: {
					supportsDeveloperRole: false,
					supportsReasoningEffort: true,
					thinkingFormat: "deepseek",
				},
			},
			{
				id: "deepseek-v4-flash",
				name: "DeepSeek V4 Flash",
				reasoning: true,
				input: ["text"],
				cost: { input: 0.14, output: 0.28, cacheRead: 0.028, cacheWrite: 0 },
				contextWindow: 1000000,
				maxTokens: 384000,
				thinkingLevelMap: {
					off: null,
					minimal: null,
					low: "low",
					medium: "medium",
					high: "high",
					xhigh: "max",
				},
				compat: {
					supportsDeveloperRole: false,
					supportsReasoningEffort: true,
					thinkingFormat: "deepseek",
				},
			},
		],
	});
}

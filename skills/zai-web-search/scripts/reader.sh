#!/usr/bin/env bash
# z.ai Web Reader via MCP Streamable HTTP
# Fetches and converts a URL to markdown/text friendly content
# Usage: reader.sh "url" [format] [retain_images] [timeout]
set -euo pipefail

URL="${1:?Usage: reader.sh \"url\" [format] [retain_images] [timeout]}"
FORMAT="${2:-markdown}"
IMAGES="${3:-true}"
TIMEOUT="${4:-20}"

AUTH_FILE="${ZAI_AUTH_FILE:-$HOME/.pi/agent/auth.json}"
if [[ ! -f "$AUTH_FILE" ]]; then
  echo "ERROR: auth file not found at $AUTH_FILE" >&2
  exit 1
fi

API_KEY=$(jq -r '.zai.key // empty' "$AUTH_FILE")
if [[ -z "$API_KEY" ]]; then
  echo "ERROR: no zai key found in $AUTH_FILE" >&2
  exit 1
fi

BASE_URL="https://api.z.ai/api/mcp/web_reader/mcp"
COMMON_ARGS=(-s -X POST "$BASE_URL"
  -H "Authorization: Bearer $API_KEY"
  -H "Content-Type: application/json"
  -H "Accept: application/json, text/event-stream")

# Step 1: Initialize MCP session
SESSION=$(curl "${COMMON_ARGS[@]}" \
  -D - \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"pi-web-reader-skill","version":"1.0.0"}}}' \
  2>/dev/null | grep -i 'mcp-session-id' | awk '{print $2}' | tr -d '\r\n')

if [[ -z "$SESSION" ]]; then
  echo "ERROR: failed to initialize MCP session" >&2
  exit 1
fi

# Step 2: Build arguments
ARGS=$(jq -n \
  --arg url "$URL" \
  --arg fmt "$FORMAT" \
  --arg imgs "$IMAGES" \
  --argjson to "$TIMEOUT" \
  '{
    url: $url,
    return_format: $fmt,
    retain_images: ($imgs == "true"),
    timeout: $to,
    no_cache: true
  }')

# Step 3: Call the reader tool
RESPONSE=$(curl "${COMMON_ARGS[@]}" \
  -H "mcp-session-id: $SESSION" \
  -d "$(jq -n \
    --argjson args "$ARGS" \
    '{jsonrpc:"2.0",id:3,method:"tools/call",params:{name:"webReader",arguments:$args}}')" \
  2>/dev/null)

# Parse SSE data lines
DATA=$(echo "$RESPONSE" | grep '^data:' | sed 's/^data://' | jq -s '.[0].result.content[0].text // .[0].result.content[0] // "No content"')

echo "$DATA" | jq -r 'if type == "string" then . | fromjson? // . else . end' 2>/dev/null || echo "$DATA"

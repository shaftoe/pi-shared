#!/usr/bin/env bash
# z.ai Web Search via MCP Streamable HTTP
# Usage: search.sh "query" [location] [content_size] [recency_filter] [domain_filter]
set -euo pipefail

QUERY="${1:?Usage: search.sh \"query\" [location] [content_size] [recency_filter] [domain_filter]}"
LOCATION="${2:-us}"
CONTENT_SIZE="${3:-medium}"
RECENCY="${4:-noLimit}"
DOMAIN="${5:-}"

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

BASE_URL="https://api.z.ai/api/mcp/web_search_prime/mcp"
COMMON_ARGS=(-s -X POST "$BASE_URL"
  -H "Authorization: Bearer $API_KEY"
  -H "Content-Type: application/json"
  -H "Accept: application/json, text/event-stream")

# Step 1: Initialize MCP session
SESSION=$(curl "${COMMON_ARGS[@]}" \
  -D - \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"pi-web-search-skill","version":"1.0.0"}}}' \
  2>/dev/null | grep -i 'mcp-session-id' | awk '{print $2}' | tr -d '\r\n')

if [[ -z "$SESSION" ]]; then
  echo "ERROR: failed to initialize MCP session" >&2
  exit 1
fi

# Step 2: Build arguments
ARGS=$(jq -n \
  --arg q "$QUERY" \
  --arg loc "$LOCATION" \
  --arg cs "$CONTENT_SIZE" \
  --arg rec "$RECENCY" \
  --arg dom "$DOMAIN" \
  '{
    search_query: $q,
    location: $loc,
    content_size: $cs,
    search_recency_filter: $rec
  } + (if $dom != "" then {search_domain_filter: $dom} else {} end)')

# Step 3: Call the search tool
RESPONSE=$(curl "${COMMON_ARGS[@]}" \
  -H "mcp-session-id: $SESSION" \
  -d "$(jq -n \
    --argjson args "$ARGS" \
    '{jsonrpc:"2.0",id:3,method:"tools/call",params:{name:"web_search_prime",arguments:$args}}')" \
  2>/dev/null)

# Parse SSE data lines
DATA=$(echo "$RESPONSE" | grep '^data:' | sed 's/^data://' | jq -s '.[0].result.content[0].text // .[0].result.content[0] // "No results"')

# The text field is a JSON-encoded string (possibly a JSON array)
echo "$DATA" | jq -r 'if type == "string" then . | fromjson? // . else . end' 2>/dev/null || echo "$DATA"

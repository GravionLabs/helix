#!/usr/bin/env bash
# UserPromptSubmit (Claude Code) and postToolUse (Copilot CLI) hook: warn when the session context is large, because every request re-reads it.
# Reads the context size of the last request from the transcript (input + cache read + cache write).
# Copilot CLI: postToolUse carries sessionId but no transcriptPath, so the hook reads
# ${COPILOT_HOME:-~/.copilot}/session-state/<sessionId>/events.jsonl (also what agentStop sends as transcriptPath);
# the last session.usage_record gives inputTokens, which already includes cache reads and writes.
# CONTEXT_WARN_TOKENS is the threshold. Default: with a known window size min(50 %, 250k) of it (the yellow ctx colour of the
# status line), else 150000. Window size: Copilot maxPromptTokens of the usage record (verified); Claude Code: 1000000 when the
# model id of the last usage line ends in [1m] (unverified), else unknown. An explicit valid value always wins. CONTEXT_WARN_STEP (default 100000) the growth
# before the next warning. Never blocks: every path exits 0; no network.
# The payload is parsed with jq when present, else with a bash JSON string scanner (no required dependency);
# both handle escapes, pretty-printed payloads, spaces after colons and any field order. Token counts are read
# from the last transcript line holding a usage object (one JSON object per line, spaces after colons allowed).
# CONTEXT_WARN_DEBUG=1 prints a one-line note on stderr when payload or transcript cannot be parsed; silent otherwise.

threshold="${CONTEXT_WARN_TOKENS:-}"
step="${CONTEXT_WARN_STEP:-100000}"
# a non-numeric, empty or overlong (> 9 digits) value falls back to the default; leading zeros are read as decimal
case "$threshold" in *[!0-9]*) threshold="" ;; esac
case "$step" in ''|*[!0-9]*) step=100000 ;; esac
if [ ${#threshold} -gt 9 ]; then threshold=""; elif [ -n "$threshold" ]; then threshold=$((10#$threshold)); fi
[ ${#step} -le 9 ] && step=$((10#$step)) || step=100000
payload="$(cat 2>/dev/null || true)"

note() { [ -n "${CONTEXT_WARN_DEBUG:-}" ] && printf 'context-warning: %s\n' "$*" >&2; return 0; }

jdecode() { # jdecode <string body>: JD = decoded JSON string (\001 and \002 stand for \\ and \")
  local x="$1"
  x=${x//'\n'/$'\n'}; x=${x//'\t'/$'\t'}; x=${x//'\r'/$'\r'}; x=${x//'\/'/"/"}
  x=${x//$'\002'/'"'}; JD=${x//$'\001'/'\'}
}
# Home directory: on Windows (Git Bash/MSYS/Cygwin) from USERPROFILE as /c/... path, since HOME may differ; else $HOME.
user_home() {
  case "$(uname -s 2>/dev/null)" in
    MINGW*|MSYS*|CYGWIN*)
      if [ -n "${USERPROFILE:-}" ]; then
        local up="${USERPROFILE//\\//}" drive
        if [[ "$up" =~ ^([A-Za-z]):(.*)$ ]]; then
          drive="$(printf '%s' "${BASH_REMATCH[1]}" | tr 'A-Z' 'a-z')"
          up="/$drive${BASH_REMATCH[2]}"
        fi
        printf '%s' "${up%/}"; return 0
      fi ;;
  esac
  printf '%s' "$HOME"
}

jsonscan() { # jsonscan <json>: sets J_transcript, J_session from the first "key": "string" pairs (keys outside strings)
  local rest between str prev="" have=0
  rest=${1//'\\'/$'\001'}; rest=${rest//'\"'/$'\002'}
  while :; do
    between="${rest%%\"*}"
    [ ${#between} -eq ${#rest} ] && break
    rest="${rest:${#between}+1}"
    str="${rest%%\"*}"
    [ ${#str} -eq ${#rest} ] && break
    rest="${rest:${#str}+1}"
    if [ "$have" = 1 ] && [[ "$between" =~ ^[[:space:]]*:[[:space:]]*$ ]]; then
      have=0
      case "$prev" in
        transcript_path) [ -n "$J_transcript" ] || { jdecode "$str"; J_transcript="$JD"; } ;;
        session_id) [ -n "$J_session" ] || { jdecode "$str"; J_session="$JD"; } ;;
        transcriptPath) [ -n "$J_ctranscript" ] || { jdecode "$str"; J_ctranscript="$JD"; } ;;
        sessionId) [ -n "$J_csession" ] || { jdecode "$str"; J_csession="$JD"; } ;;
      esac
    else
      prev="$str"; have=1
    fi
  done
}

J_transcript=""; J_session=""; J_ctranscript=""; J_csession=""
if command -v jq >/dev/null 2>&1; then
  transcript="$(printf '%s' "$payload" | jq -r '.transcript_path // empty' 2>/dev/null)"
  session="$(printf '%s' "$payload" | jq -r '.session_id // empty' 2>/dev/null)"
  J_ctranscript="$(printf '%s' "$payload" | jq -r '.transcriptPath // empty' 2>/dev/null)"
  J_csession="$(printf '%s' "$payload" | jq -r '.sessionId // empty' 2>/dev/null)"
else
  jsonscan "$payload"
  transcript="$J_transcript"; session="$J_session"
fi
host=claude
if [ -z "$transcript" ] && [ -z "$session" ] && { [ -n "$J_ctranscript" ] || [ -n "$J_csession" ]; }; then
  host=copilot
  session="$J_csession"
  transcript="$J_ctranscript"
  if [ -z "$transcript" ] && [[ "$session" =~ ^[A-Za-z0-9_-]+$ ]]; then
    transcript="${COPILOT_HOME:-$(user_home)/.copilot}/session-state/$session/events.jsonl"
  fi
fi
[ -n "$transcript" ] || { note "no transcript_path in payload"; exit 0; }
[ -r "$transcript" ] || { note "transcript not readable: $transcript"; exit 0; }
[ -n "$session" ] || session="unknown"

# the last 2 MB hold the newest requests, however long the session is
if [ "$host" = copilot ]; then
  line="$(tail -c 2000000 "$transcript" 2>/dev/null | grep -a '"session.usage_record"' | tail -n 1)"
else
  line="$(tail -c 2000000 "$transcript" 2>/dev/null | grep -a '"cache_read_input_tokens"' | tail -n 1)"
fi
[ -n "$line" ] || { note "no usage line in transcript"; exit 0; }

num() { printf '%s' "$line" | grep -oE "\"$1\"[[:space:]]*:[[:space:]]*[0-9]+" | head -n 1 | grep -o '[0-9]*$'; }
if [ "$host" = copilot ]; then
  a="$(num inputTokens)"; b=0; c=0 # inputTokens already includes cacheReadTokens and cacheWriteTokens
else
  a="$(num input_tokens)"; b="$(num cache_read_input_tokens)"; c="$(num cache_creation_input_tokens)"
fi
ctx=$(( ${a:-0} + ${b:-0} + ${c:-0} )) 2>/dev/null || { note "unreadable token counts"; exit 0; }

if [ -z "$threshold" ]; then # no explicit value: relative to the window size when known
  window=0
  if [ "$host" = copilot ]; then
    window="$(num maxPromptTokens)"
  elif printf '%s' "$line" | grep -qE '"model"[[:space:]]*:[[:space:]]*"[^"]*\[1m\]"'; then
    window=1000000
  fi
  case "$window" in ''|*[!0-9]*) window=0 ;; esac
  if [ ${#window} -le 9 ] && [ "$((10#$window))" -gt 0 ]; then
    threshold=$(( 10#$window / 2 )); [ "$threshold" -gt 250000 ] && threshold=250000
  else
    threshold=150000
  fi
fi

state="${TMPDIR:-/tmp}/$host-context-warning-${session//[^A-Za-z0-9_-]/_}"

if [ "$ctx" -lt "$threshold" ]; then
  rm -f "$state" 2>/dev/null
  exit 0
fi

last=0
[ -r "$state" ] && last="$(cat "$state" 2>/dev/null)"
case "$last" in ''|*[!0-9]*) last=0 ;; esac
if [ "$last" -gt 0 ] && [ "$ctx" -lt $(( last + step )) ]; then
  exit 0
fi

printf '%s' "$ctx" > "$state" 2>/dev/null

msg="$(printf 'Context is %sk tokens (limit %sk). Finish the current step, write a short hand-off, then /clear (or /compact) and resume.' "$(( ctx / 1000 ))" "$(( threshold / 1000 ))")"
if [ "$host" = copilot ]; then
  printf '{"systemMessage":"%s","additionalContext":"%s","hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"%s"}}\n' "$msg" "$msg" "$msg"
else
  printf '{"systemMessage":"%s","hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"%s"}}\n' "$msg" "$msg"
fi
exit 0

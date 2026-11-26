#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${AFKARENA_REPO_DIR:-$HOME/afkarena-app}"
PB_MIGRATIONS="${AFKARENA_PB_MIGRATIONS:-$HOME/infra/pocketbase/pb_migrations}"
STAMP_FILE="${AFKARENA_DEPLOY_STAMP:-$HOME/.afkarena-deployed-rev}"
CI_TIMEOUT="${AFKARENA_CI_TIMEOUT:-1200}"
CI_POLL="${AFKARENA_CI_POLL:-30}"
CI_REPO="${AFKARENA_CI_REPO:-Reximon/afkarena-app}"
TOKEN_FILE="${AFKARENA_GITHUB_TOKEN_FILE:-$HOME/.config/afkarena/github-token}"

cd "$REPO_DIR"

exec 9>/tmp/afkarena-deploy.lock
flock -n 9 || { echo 'Another deploy is already running'; exit 0; }

ci_state() {
  local auth=()
  if [ -r "$TOKEN_FILE" ]; then
    auth=(-H "Authorization: Bearer $(cat "$TOKEN_FILE")")
  fi

  curl -sS -H 'Accept: application/vnd.github+json' -H 'User-Agent: afkarena-deploy' \
    "${auth[@]}" \
    "https://api.github.com/repos/$CI_REPO/actions/runs?head_sha=$target&per_page=20" |
    python3 -c '
import json, sys

try:
    data = json.load(sys.stdin)
except json.JSONDecodeError:
    print("error")
    raise SystemExit

if "workflow_runs" not in data:
    print("error")
    raise SystemExit

runs = [run for run in data["workflow_runs"] if run.get("head_sha") == sys.argv[1]]
if not runs:
    print("pending")
elif any(run.get("status") != "completed" for run in runs):
    print("pending")
elif all(run.get("conclusion") == "success" for run in runs):
    print("success")
else:
    print("failed")
' "$target"
}

wait_for_ci() {
  echo "Waiting for CI on $(git rev-parse --short "$target")"
  local deadline=$(( $(date +%s) + CI_TIMEOUT ))
  local state

  while :; do
    state="$(ci_state)" || state=error
    case "$state" in
      success) echo 'CI green'; return 0 ;;
      failed) echo 'CI is not green, skipping deploy' >&2; return 1 ;;
      pending) ;;
      *) echo 'Could not read the CI status' >&2; return 2 ;;
    esac

    if [ "$(date +%s)" -ge "$deadline" ]; then
      echo "CI did not finish within ${CI_TIMEOUT}s" >&2
      return 2
    fi
    sleep "$CI_POLL"
  done
}

git fetch --quiet origin master
target="$(git rev-parse origin/master)"

if [ "$(git rev-parse HEAD)" != "$target" ] && [ -n "$(git status --porcelain)" ]; then
  echo 'Working tree has local changes, skipping deploy' >&2
  exit 1
fi

if [ "$(git rev-parse HEAD)" = "$target" ] &&
  [ "$(cat "$STAMP_FILE" 2>/dev/null || true)" = "$target" ]; then
  exit 0
fi

set +e
wait_for_ci
ci_result=$?
set -e
case "$ci_result" in
  0) ;;
  1) exit 0 ;;
  *) exit 1 ;;
esac

if [ "$(git rev-parse HEAD)" != "$target" ]; then
  echo "Deploying $(git rev-parse --short "$target")"
  git merge --ff-only "$target"
fi

if ! diff -rq pb_migrations "$PB_MIGRATIONS" >/dev/null 2>&1; then
  cp pb_migrations/*.js "$PB_MIGRATIONS"/
  docker restart pocketbase >/dev/null
  echo 'PocketBase migrations synced'
fi

docker compose up -d --build
echo "$target" > "$STAMP_FILE"
echo 'Deploy finished'
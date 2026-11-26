#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${AFKARENA_REPO_DIR:-$HOME/afkarena-app}"
PB_MIGRATIONS="${AFKARENA_PB_MIGRATIONS:-$HOME/infra/pocketbase/pb_migrations}"
STAMP_FILE="${AFKARENA_DEPLOY_STAMP:-$HOME/.afkarena-deployed-rev}"

cd "$REPO_DIR"

exec 9>/tmp/afkarena-deploy.lock
flock -n 9 || { echo 'Another deploy is already running'; exit 0; }

git fetch --quiet origin master
target="$(git rev-parse origin/master)"

if [ "$(git rev-parse HEAD)" != "$target" ]; then
  if [ -n "$(git status --porcelain)" ]; then
    echo 'Working tree has local changes, skipping deploy' >&2
    exit 1
  fi
  echo "Deploying $(git rev-parse --short "$target")"
  git merge --ff-only "$target"
fi

if [ "$(cat "$STAMP_FILE" 2>/dev/null || true)" = "$target" ]; then
  exit 0
fi

if ! diff -rq pb_migrations "$PB_MIGRATIONS" >/dev/null 2>&1; then
  cp pb_migrations/*.js "$PB_MIGRATIONS"/
  docker restart pocketbase >/dev/null
  echo 'PocketBase migrations synced'
fi

docker compose up -d --build
echo "$target" > "$STAMP_FILE"
echo 'Deploy finished'
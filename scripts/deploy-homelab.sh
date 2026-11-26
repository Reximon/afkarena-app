#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${AFKARENA_REPO_DIR:-$HOME/afkarena-app}"
PB_MIGRATIONS="${AFKARENA_PB_MIGRATIONS:-$HOME/infra/pocketbase/pb_migrations}"

cd "$REPO_DIR"

exec 9>/tmp/afkarena-deploy.lock
flock -n 9 || { echo 'Another deploy is already running'; exit 0; }

git fetch --quiet origin master
if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/master)" ]; then
  exit 0
fi

if [ -n "$(git status --porcelain)" ]; then
  echo 'Working tree has local changes, skipping deploy' >&2
  exit 1
fi

echo "Deploying $(git rev-parse --short origin/master)"
git merge --ff-only origin/master

if ! diff -rq pb_migrations "$PB_MIGRATIONS" >/dev/null 2>&1; then
  cp pb_migrations/*.js "$PB_MIGRATIONS"/
  docker restart pocketbase >/dev/null
  echo 'PocketBase migrations synced'
fi

docker compose up -d --build
echo 'Deploy finished'
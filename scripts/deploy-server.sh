#!/usr/bin/env bash
# Zero-downtime deploy for the droplet (pm2 app "intellex", next start on :3004).
#
# Building inside the live checkout replaced .next while the old server was still serving it,
# so for the length of every build pages referenced chunks that no longer existed and visitors
# got "Application error". This builds in a separate checkout, swaps the finished build in,
# restarts, health-checks, and rolls back to the previous build if the check fails.
#
# Usage on the server: nohup bash scripts/deploy-server.sh >/dev/null 2>&1 &
# Progress: /tmp/intellex-deploy.status (RUNNING, DEPLOYED, FAILED_*, ROLLED_BACK)
set -u

LIVE=/root/intellexform
BUILD=/root/intellexform-build
STATUS=/tmp/intellex-deploy.status
LOG=/tmp/intellex-build.log
PORT=3004

echo RUNNING > "$STATUS"

if [ ! -d "$BUILD/.git" ]; then
  git clone -q "$(git -C "$LIVE" remote get-url origin)" "$BUILD" || { echo FAILED_CLONE > "$STATUS"; exit 1; }
fi
cd "$BUILD" || exit 1
git fetch -q origin main && git reset -q --hard origin/main || { echo FAILED_GIT > "$STATUS"; exit 1; }

# Share dependencies and secrets with the live app.
ln -sfn "$LIVE/node_modules" "$BUILD/node_modules"
for f in .env .env.local; do
  if [ -f "$LIVE/$f" ]; then cp "$LIVE/$f" "$BUILD/$f"; fi
done

rm -rf "$BUILD/.next"
if ! NODE_OPTIONS=--max-old-space-size=1536 nice -n 10 npm run build > "$LOG" 2>&1; then
  echo FAILED_BUILD > "$STATUS"
  exit 1
fi

# Bring the live checkout (public assets, sources) to the same commit, then swap builds.
cd "$LIVE" || exit 1
git pull -q --ff-only origin main || { echo FAILED_PULL > "$STATUS"; exit 1; }

rsync -a --delete --exclude cache "$BUILD/.next/" "$LIVE/.next.new/"
rsync -a --delete "$BUILD/.tutorial-content/" "$LIVE/.tutorial-content.new/"

rm -rf .next.bak .tutorial-content.bak
mv .next .next.bak && mv .next.new .next
mv .tutorial-content .tutorial-content.bak && mv .tutorial-content.new .tutorial-content
pm2 restart intellex > /dev/null

healthy() {
  for _ in $(seq 1 20); do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://127.0.0.1:$PORT/pricing")
    [ "$code" = "200" ] && return 0
    sleep 2
  done
  return 1
}

if healthy; then
  echo DEPLOYED > "$STATUS"
else
  rm -rf .next .tutorial-content
  mv .next.bak .next && mv .tutorial-content.bak .tutorial-content
  pm2 restart intellex > /dev/null
  echo ROLLED_BACK > "$STATUS"
fi

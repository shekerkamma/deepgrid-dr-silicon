#!/usr/bin/env bash
# Push main to all three Pages repos and report all three deployments.
#
# The three repos are independent: none is a fork of another and nothing syncs them. They drifted
# once already, and the cost was reviewing a stale site while believing it was current. This is the
# one command that keeps them identical.
#
# The source is v2. The other two are mirrors and should never be committed to directly; a push
# here is a force-push and will discard anything that only exists there.
#
# Usage:  bash scripts/sync-mirrors.sh [--no-wait]
set -euo pipefail

OWNER="shekerkamma"
SOURCE="deepgrid-dr-silicon-v2"
MIRRORS=(deepgrid-dr-silicon deepgrid-dr-silicon_new)
WAIT=1
[ "${1:-}" = "--no-wait" ] && WAIT=0

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is dirty. Commit or stash before syncing." >&2
  exit 1
fi
SHA="$(git rev-parse HEAD)"
echo "Syncing $(git rev-parse --short HEAD) to $((${#MIRRORS[@]} + 1)) repos"

# Source first. If its gate fails, the mirrors should not receive the commit at all.
git push "https://github.com/$OWNER/$SOURCE.git" main:main
for repo in "${MIRRORS[@]}"; do
  echo "  -> $repo (force; mirror, not a source)"
  git push --force "https://github.com/$OWNER/$repo.git" main:main
done

[ "$WAIT" -eq 0 ] && { echo "Pushed. Not waiting for deployments."; exit 0; }

echo
fail=0
for repo in "$SOURCE" "${MIRRORS[@]}"; do
  # Match the run by commit, not "the latest run": a concurrent run would otherwise be reported
  # as this one's result.
  id=""
  for _ in $(seq 30); do
    id="$(gh run list --repo "$OWNER/$repo" --limit 10 \
          --json databaseId,headSha --jq "[.[] | select(.headSha==\"$SHA\")][0].databaseId" 2>/dev/null || true)"
    [ -n "$id" ] && [ "$id" != "null" ] && break
    sleep 5
  done
  if [ -z "$id" ] || [ "$id" = "null" ]; then
    echo "FAIL $repo: no workflow run found for $SHA"; fail=1; continue
  fi
  while [ "$(gh run view "$id" --repo "$OWNER/$repo" --json status --jq .status)" != "completed" ]; do sleep 20; done
  concl="$(gh run view "$id" --repo "$OWNER/$repo" --json conclusion --jq .conclusion)"
  printf '%-26s %s\n' "$repo" "$concl"
  [ "$concl" = "success" ] || fail=1
done

echo
for repo in "$SOURCE" "${MIRRORS[@]}"; do
  live="$(curl -s "https://$OWNER.github.io/$repo/build-info.json?cb=$RANDOM" \
          | python3 -c 'import sys,json;d=json.load(sys.stdin);print(d["commit"][:7],d["base"])' 2>/dev/null || echo "unreachable")"
  printf '%-26s %s\n' "$repo" "$live"
done

exit "$fail"

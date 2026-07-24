---
name: reset-demo-environment
description: Resets the Barkenciaga app and demo environment to a clean slate for customer enablement sessions. Deletes unmerged git branches (local and remote), Barkenciaga/BRK Cursor plans, and .orchestrate artifacts while keeping main and all Jira stories intact. Use when preparing for a customer demo, resetting Barkenciaga, cleaning up WIP branches/plans, or when the user asks for a clean slate.
---

# Reset Barkenciaga demo environment

Full clean slate for customer demos. Run this when the user wants Barkenciaga ready for a fresh enablement session.

## Hard rules

1. **Never modify Jira.** All BRK epics/stories/bugs stay intact — no status changes, no deletes, no edits.
2. **Never rewrite or reset `main`.** Keep every commit already merged to `main` / `origin/main`.
3. **Never force-push `main`.**
4. **Confirm the deletion list** with the user before deleting remote branches or Cursor plans. Show keys/paths; wait for approval.
5. Prefer `git push origin --delete <branch>` over remote force operations.

## What to remove

| Target | Action |
|--------|--------|
| Local branches except `main` | Delete (`git branch -D`) |
| Remote branches except `origin/main` | Delete on GitHub |
| Local worktrees for feature branches | `git worktree remove` (or remove orphan dirs under `Projects/barkenciaga-*`) |
| `.orchestrate/` run state | Delete the directory tree (commit + push if tracked on `main`) |
| Cursor plans for Barkenciaga / BRK | Delete matching files under `~/.cursor/plans/` |

## What to keep

- Current `main` application code (including merged CI, Vitest, seeded demo bugs, TECH_DEBT, showroom)
- All Jira issues in project BRK
- In-repo docs already on `main` (e.g. `docs/superpowers/plans/*`, `DEMO_SCRIPTS.md`, `TECH_DEBT.md`) unless the user explicitly asks to remove them

## Workflow

Copy and track:

```
Reset progress:
- [ ] 1. Inventory
- [ ] 2. Confirm with user
- [ ] 3. Remove worktrees
- [ ] 4. Delete local branches
- [ ] 5. Delete remote branches
- [ ] 6. Remove .orchestrate artifacts
- [ ] 7. Remove Cursor plans
- [ ] 8. Verify clean slate
```

### 1. Inventory

From the Barkenciaga repo root, gather:

```bash
git fetch --prune origin
git status -sb
git branch -a
git worktree list
ls -d ../barkenciaga-* 2>/dev/null || true
ls -la .orchestrate 2>/dev/null || true
```

List Cursor plans that mention Barkenciaga or BRK:

```bash
# Personal Cursor plans directory
ls ~/.cursor/plans/*brk* ~/.cursor/plans/*barkenciaga* ~/.cursor/plans/seed_teaching_bugs* 2>/dev/null
# Also search content for barkenciaga / BRK-
rg -l -i 'barkenciaga|BRK-' ~/.cursor/plans/*.plan.md 2>/dev/null
```

Build a concrete deletion list (branch names, plan paths, orchestrate paths).

### 2. Confirm with user

Show:

1. Branches to delete (local + remote)
2. Worktrees to remove
3. Plan files to delete
4. Whether `.orchestrate/` will be removed (and if a commit on `main` is needed)

Explicitly restate: **main and Jira will not be touched.**

Wait for approval before any deletes.

### 3. Remove worktrees

For each non-main worktree:

```bash
git worktree remove <path> --force   # only if user approved
# If the directory remains orphaned:
rm -rf ../barkenciaga-<feature>
```

Ensure you end on the main worktree at the Barkenciaga repo path.

### 4. Delete local branches

```bash
git checkout main
git pull --ff-only origin main   # if tracking is set and network available
git branch | grep -v '^\*' | grep -v '^  main$' | xargs -r git branch -D
```

Do not delete `main`.

### 5. Delete remote branches

List remotes excluding main:

```bash
git branch -r | grep -v 'origin/HEAD' | grep -v 'origin/main$'
```

Delete approved remotes in one push when possible:

```bash
git push origin --delete <branch1> <branch2> ...
git fetch --prune origin
```

If a remote is already gone, prune and continue — do not fail the whole reset.

### 6. Remove `.orchestrate` artifacts

If `.orchestrate/` exists:

```bash
rm -rf .orchestrate
```

If those files were tracked on `main`, commit and push:

```bash
git add -A .orchestrate
git status
git commit -m "$(cat <<'EOF'
Remove orchestration demo artifacts for clean customer reset.

EOF
)"
git push origin main
```

Only commit when tracked files changed. Do not invent unrelated cleanup in the same commit.

### 7. Remove Cursor plans

Delete **approved** Barkenciaga/BRK plan files under `~/.cursor/plans/`. Typical patterns:

- `brk-*.plan.md`
- `fix_brk-*.plan.md`
- `barkenciaga*.plan.md`
- `seed_teaching_bugs*.plan.md`
- Other plans whose content is clearly Barkenciaga-demo-specific (confirm if ambiguous)

Do **not** delete unrelated personal plans (decks, other customers, etc.). When a plan only *mentions* Barkenciaga in passing (e.g. a workshop deck), skip unless the user asks to remove it.

Prefer deleting specific files over `rm -rf ~/.cursor/plans`.

### 8. Verify clean slate

```bash
git branch -a          # only main + origin/main
git worktree list      # single main worktree
git status -sb         # clean, synced with origin/main
test ! -d .orchestrate && echo "no orchestrate"
```

Confirm no leftover `brk-*` / `barkenciaga*` plans the user wanted removed.

Report back:

- Branches deleted (counts)
- Plans deleted (names)
- Whether `.orchestrate` was removed / committed
- Reminder that Jira BRK backlog is unchanged and `main` still has merged demo content (seeded bugs, DEMO-TODOs, CI)

## After reset — ready state

Barkenciaga is ready when:

1. Agent is on `main`, up to date with `origin/main`
2. No feature branches or WIP worktrees remain
3. No leftover SS26/orchestrate or unmerged feature WIP
4. Jira BRK stories are still available as the backlog for the next demo

Optional next steps (only if the user asks): pick a BRK ticket and implement fresh from `main`, or run `pnpm install && pnpm dev` for a live walkthrough.

## Do not

- Close or edit Jira issues as part of reset
- Delete `main` or rewrite history on `main`
- Merge stale feature branches “to save work” during reset — discard is the point
- Wipe `~/.cursor/plans` wholesale
- Remove in-repo merged demo fixtures (`TECH_DEBT.md`, seeded bugs, showroom) unless explicitly requested

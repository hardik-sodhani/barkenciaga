---
name: hooray-on-pr
description: Celebrate after a GitHub pull request is created. Use when opening, creating, or filing a PR with gh pr create, or when the user asks to make a pull request.
---

# Hooray on PR

After a pull request is successfully created (the `gh pr create` command succeeds and a PR URL exists):

1. Call `show_confetti` on `cursor-app-control` with `message` set to `hooray`.
2. In the user-facing reply, include the word **hooray** (that exact word) and the PR URL.

Do not skip this after a successful create. Do not celebrate failed creates, drafts that were not opened, or "open a PR later" plans.

# Execute Parallel Tasks Across Worktrees

Spawn one subagent per worktree, each working on an independent task simultaneously.

## Usage
```
/exe-parallel
```
Then provide a task map when prompted, OR pass it inline:
```
/exe-parallel feature-auth:"Build login and signup pages" feature-dash:"Build dashboard with charts"
```

## Instructions

1. List existing worktrees:
```bash
git worktree list
```

2. If no worktrees exist in `.worktrees/`, tell the user to run `/init-parallel` first.

3. Ask the user for a task assignment per worktree (if not provided inline). Format:
```
branch-name: "Description of what to build"
```

4. For EACH worktree, spawn a **subagent** with this prompt pattern:
```
You are working in a git worktree at .worktrees/<branch-name>.
Your working directory is: <absolute-path-to-worktree>

TASK: <user's task description>

RULES:
- Only modify files within your worktree directory
- Do NOT touch files outside your worktree
- Run tests if available before finishing
- Commit your work with a descriptive message when done
- Do NOT merge into main — just commit on your branch
```

5. Launch all subagents simultaneously (do not wait for one to finish before starting the next).

6. When all subagents report back, print a summary:
```
✅ All parallel tasks complete:

| Branch | Task | Status | Files Changed |
|--------|------|--------|---------------|
| feature-auth | Login/signup pages | ✅ Done | 5 files |
| feature-dash | Dashboard charts | ✅ Done | 8 files |

Next steps:
- Review each branch: git diff main..<branch>
- Merge when ready: git merge <branch>
- Clean up: git worktree remove .worktrees/<branch>
```

## Tips
- Keep tasks on different files/directories to avoid merge conflicts
- Each agent can run its own dev server on a different port
- If a task fails, you can re-run just that branch's agent

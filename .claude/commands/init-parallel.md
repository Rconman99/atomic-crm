# Initialize Parallel Worktrees

Create multiple git worktree branches for parallel development.

## Usage
```
/init-parallel <branch1> <branch2> [branch3] ...
```

## Instructions

1. Parse the user's input to get branch names. Each name becomes a worktree.

2. For each branch name, run:
```bash
git worktree add .worktrees/<branch-name> -b <branch-name>
```

3. Copy the `.env.development` (or `.env`) file into each worktree so they can run independently:
```bash
for dir in .worktrees/*/; do
  cp .env.development "$dir" 2>/dev/null || true
  cp .env "$dir" 2>/dev/null || true
done
```

4. Print a summary table:
```
✅ Parallel worktrees ready:

| Branch | Path | Status |
|--------|------|--------|
| feature-x | .worktrees/feature-x | Ready |
| feature-y | .worktrees/feature-y | Ready |

Next: Use /exe-parallel to assign tasks to each branch.
```

## Notes
- All worktrees branch from the current HEAD
- Each worktree is a full working copy — agents can run dev servers, tests, etc.
- To clean up: `git worktree remove .worktrees/<name>` or `/cleanup-parallel`

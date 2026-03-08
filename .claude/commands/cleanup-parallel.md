# Clean Up Parallel Worktrees

Remove all worktrees created by /init-parallel.

## Usage
```
/cleanup-parallel [--force]
```

## Instructions

1. List all worktrees:
```bash
git worktree list
```

2. For each worktree under `.worktrees/`:
   - Check if there are uncommitted changes: `git -C .worktrees/<name> status --porcelain`
   - If there are uncommitted changes and `--force` was NOT passed, warn the user and skip
   - If clean or `--force` was passed, remove it:
```bash
git worktree remove .worktrees/<name>
```

3. Optionally delete the branches too (ask the user):
```bash
git branch -d <branch-name>
```

4. Clean up the `.worktrees/` directory if empty:
```bash
rmdir .worktrees 2>/dev/null || true
```

5. Print summary of what was cleaned up.

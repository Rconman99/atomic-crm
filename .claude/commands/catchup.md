# Session Catchup

Get up to speed on what happened since your last session.

## Usage
```
/catchup
```

## Instructions

1. Show recent git history (last 20 commits, one-line format):
```bash
git log --oneline -20
```

2. Show any uncommitted changes:
```bash
git status
git diff --stat
```

3. Check for any active worktrees:
```bash
git worktree list
```

4. Read the CLAUDE.md file for project context:
```bash
cat CLAUDE.md 2>/dev/null || echo "No CLAUDE.md found"
```

5. Check for any TODO/FIXME/HACK comments added recently:
```bash
git diff HEAD~5 --name-only 2>/dev/null | head -20
```

6. Summarize:
```
📋 Session Catchup:

Last 5 commits: <summary>
Working tree: <clean/dirty>
Active worktrees: <count>
Open tasks: <any TODOs found>

Ready to work. What's the plan for this session?
```

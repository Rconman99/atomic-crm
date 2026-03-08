# /debug — Systematic Debugging Workflow

Never guess at bugs. Follow this systematic process to find and fix them reliably.

## Instructions

The user will describe a bug or paste an error. Follow these steps IN ORDER:

### Step 1: Reproduce
- Read the error message carefully. What file? What line? What does it say?
- Check if the error is in the terminal (build/runtime) or browser (console).
- Try to reproduce it: `npm run dev` or `npm run build`
- If you can't reproduce, ask the user for exact steps.

### Step 2: Isolate
- Read the file mentioned in the error: use the Read tool on the exact file + line
- Check git blame: `git log --oneline -5 -- [file]` — what changed recently?
- Check if the error is in OUR code or a dependency
- Narrow down: is it a data issue, a logic issue, or a configuration issue?

### Step 3: Hypothesize
List 3 possible causes, ranked by likelihood:
1. [Most likely cause and why]
2. [Second most likely]
3. [Third possibility]

Tell the user your top hypothesis before fixing.

### Step 4: Fix
- Fix the MOST LIKELY cause first
- Make the SMALLEST possible change
- If the fix requires changing more than one file, explain why

### Step 5: Verify
- Run the build: `npm run build 2>&1 | tail -20`
- Run tests if they exist: `npm test -- --watchAll=false 2>&1 | tail -20`
- Check that the fix doesn't break anything else
- If the original error is gone but new errors appear, go back to Step 2

### Step 6: Document
- Add to CLAUDE.md Common Mistakes if this is a pattern
- Suggest a test that would catch this bug in the future
- Commit the fix with a descriptive message: `fix: [what was wrong and why]`

### Rules
- NEVER apply a fix without understanding the root cause
- NEVER suppress errors with try/catch unless you handle them properly
- NEVER say "it works for me" — if the user says it's broken, it's broken
- If stuck after 3 attempts, suggest a different approach entirely

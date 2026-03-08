# /refactor — Improve Code Without Changing Behavior

Refactoring makes code better without adding features. The golden rule: tests pass before AND after.

## Instructions

The user will point to code they want improved. Follow this process:

### Step 1: Understand Current State
- Read the file(s) to refactor
- Run existing tests: `npm test -- --watchAll=false 2>&1 | tail -20`
- If no tests exist, WRITE TESTS FIRST before refactoring
- Note what the code currently does (inputs → outputs)

### Step 2: Identify Improvement Areas
Look for these code smells and rank by impact:

| Smell | Fix |
|-------|-----|
| Component > 200 lines | Extract sub-components |
| Repeated code (3+ times) | Extract to shared function/hook |
| Complex conditionals | Extract to named helper function |
| Mixed concerns (data + UI) | Separate into hook + component |
| `any` types | Define proper interfaces |
| Magic numbers/strings | Extract to constants |
| Deeply nested callbacks | Flatten with async/await or extract |
| Props drilling (3+ levels) | Use context or composition |
| God component (does everything) | Split by responsibility |

### Step 3: Plan the Refactor
Present the plan to the user:
- What will change (and what will NOT change)
- Expected improvement (readability, maintainability, performance)
- Risk level (low/medium/high)
- Number of files affected

### Step 4: Execute
- Make changes incrementally (one improvement at a time)
- Run tests after EACH change
- If a test fails, revert immediately and investigate
- Commit each successful refactor step separately

### Step 5: Verify
- All original tests still pass
- No new warnings or errors
- Bundle size hasn't increased significantly
- Run: `npm run build 2>&1 | tail -10`

### Rules
- NEVER refactor and add features in the same commit
- NEVER delete tests during a refactor
- NEVER refactor code you don't have tests for (write tests first)
- If you're not sure a change is safe, DON'T make it

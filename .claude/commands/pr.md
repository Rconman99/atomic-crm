# Create Pull Request

Generate a well-formatted pull request with description, changes summary, and testing notes.

## Usage
```
/pr [base-branch]
```
Base branch defaults to `main`.

## Instructions

1. Determine the base branch (default: `main`):
```bash
BASE=${1:-main}
```

2. Get the diff summary:
```bash
git diff $BASE...HEAD --stat
git log $BASE..HEAD --oneline
```

3. Get the full diff for analysis:
```bash
git diff $BASE...HEAD
```

4. Generate a PR with this structure:

**Title**: Short, descriptive (under 70 chars). Use conventional commit style:
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for refactoring
- `chore:` for config/tooling changes

**Body**:
```markdown
## Summary
<2-3 bullet points describing what changed and why>

## Changes
<File-by-file breakdown of significant changes>

## Testing
- [ ] <Specific test scenarios to verify>
- [ ] Visual regression check
- [ ] No console errors

## Screenshots
<If UI changes, note that screenshots should be added>
```

5. Create the PR using the gh CLI:
```bash
gh pr create --title "<title>" --body "<body>" --base $BASE
```

6. If `gh` is not installed or authenticated, output the formatted PR description for manual creation.

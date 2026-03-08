# /spec — Write a Feature Specification

Before building anything, write a spec. This prevents wasted effort and catches design issues early.

## Instructions

The user will describe a feature they want to build. Create a specification document following this structure:

### 1. Gather Context
- Read CLAUDE.md for project state and conventions
- Check the existing file structure: `find src/ -name "*.tsx" -o -name "*.ts" | head -40`
- Identify related existing components or patterns

### 2. Write the Spec

Create a markdown spec with these sections:

```markdown
# Feature: [Name]

## User Story
As a [role], I want to [action] so that [benefit].

## Requirements
1. [Specific, testable requirement]
2. [Another requirement]
3. [Edge case handling]

## Technical Design
- **New files:** [list files to create with paths]
- **Modified files:** [list files to change]
- **Database changes:** [new tables, columns, migrations]
- **New dependencies:** [packages to install, if any]

## Component Hierarchy
[Parent] → [Child] → [Grandchild]

## Data Flow
1. User does X
2. Component calls Y hook
3. Hook calls Supabase Z
4. Response updates state
5. UI re-renders with new data

## Edge Cases
- What happens when data is empty?
- What happens when the API fails?
- What happens on slow connections?
- What happens with invalid input?

## Acceptance Criteria
- [ ] Criterion 1 (specific and testable)
- [ ] Criterion 2
- [ ] Criterion 3

## Implementation Steps
1. [First atomic step]
2. [Second step — can test independently]
3. [Continue until feature is complete]
```

### 3. Present for Review

Show the spec to the user. Ask if anything should change before building.

### 4. Save the Spec

Save to `docs/specs/[feature-name].md` for reference.

> **Rule:** Never start coding without a reviewed spec. The 10 minutes spent speccing saves hours of rework.

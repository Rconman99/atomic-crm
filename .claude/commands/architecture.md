# /architecture — Design Before You Build

Architecture decisions are the hardest to change later. Get them right upfront.

## Instructions

The user will describe something they want to build. Before writing ANY code, design the architecture.

### Step 1: Understand the Scope
- What problem does this solve?
- Who uses it? (user roles, personas)
- How much data will it handle? (10 rows or 10,000?)
- What existing code does it interact with?
- Read CLAUDE.md and relevant files to understand current patterns

### Step 2: Design the Data Model
```
[Table Name]
├── id (uuid, primary key)
├── [field] ([type])
├── [field] ([type])
├── created_at (timestamptz)
├── updated_at (timestamptz)
└── [foreign_key]_id → [related_table].id
```

Define:
- Tables and their columns with types
- Relationships (one-to-many, many-to-many)
- Indexes (what will be queried/sorted?)
- RLS policies (who can read/write what?)

### Step 3: Design the Component Tree
```
[PageComponent]
├── [HeaderSection]
├── [FilterBar]
├── [DataList]
│   ├── [ListItem]
│   │   ├── [ItemHeader]
│   │   └── [ItemActions]
│   └── [EmptyState]
├── [CreateDialog]
└── [Pagination]
```

For each component, define:
- Props interface
- Data it needs (and where it comes from)
- User interactions it handles
- Loading/error/empty states

### Step 4: Design the Data Flow
```
User Action → Component → Hook → Supabase → Database
                                      ↓
Database → Supabase → Hook → Component → UI Update
```

Map the complete flow for each user action:
1. Create: form → validate → insert → refresh list → show success
2. Read: page load → fetch → loading state → render data
3. Update: edit → validate → update → optimistic UI → confirm
4. Delete: confirm dialog → soft delete → remove from list → undo option

### Step 5: Identify Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| [What could go wrong] | [How bad] | [How to prevent it] |

### Step 6: Present the Architecture
Show the user the complete design:
- Data model diagram
- Component tree
- Data flow for key actions
- Risk table
- Estimated implementation steps (numbered, atomic)

Ask for approval before writing any code.

### Rules
- NEVER start coding without an approved architecture
- NEVER create tables without defining RLS policies
- NEVER design components without defining their loading/error/empty states
- ALWAYS consider: what happens at scale? (100 users, 10,000 records)
- ALWAYS design the simplest thing that works — complexity is the enemy

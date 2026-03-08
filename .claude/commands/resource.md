# Scaffold a New react-admin Resource

Generate all CRUD components for a new resource following the project's existing patterns.

## Usage
```
/resource <resource-name>
```
Example: `/resource clients`

## Instructions

1. Parse the resource name from the user's input. Convert to:
   - **singular**: e.g., `client` (for component names)
   - **plural**: e.g., `clients` (for table name and resource registration)
   - **PascalCase**: e.g., `Client` (for component naming)

2. Check existing patterns by reading a reference resource:
```bash
ls src/components/atomic-crm/deals/ 2>/dev/null || ls src/components/atomic-crm/contacts/ 2>/dev/null
```
Read 2-3 files from the reference to understand the component pattern, imports, and data provider usage.

3. Create the resource directory:
```bash
mkdir -p src/components/atomic-crm/<plural>/
```

4. Generate these files following the existing patterns EXACTLY:

### <PascalCase>List.tsx
- Table/Datagrid view with sortable columns
- Status shown as colored pills
- Key fields visible (name, related company, status, dates, amounts)
- Bulk action checkboxes
- Pagination

### <PascalCase>Show.tsx
- Two-column layout (60/40)
- Left: all fields in card sections
- Right: activity feed / related records
- Edit button in toolbar

### <PascalCase>Create.tsx
- Form with proper input types for each field
- Company/contact selectors as ReferenceInput
- Date pickers for date fields
- Validation on required fields

### <PascalCase>Edit.tsx
- Same as Create but pre-populated
- Status transition logic if applicable
- Updated_at shown as read-only

### index.ts
- Export all components
```typescript
export { <PascalCase>List } from './<PascalCase>List';
export { <PascalCase>Show } from './<PascalCase>Show';
export { <PascalCase>Create } from './<PascalCase>Create';
export { <PascalCase>Edit } from './<PascalCase>Edit';
```

5. Register the resource in the main app config. Find where other resources are registered (look for `<Resource name="deals"`) and add:
```tsx
<Resource
  name="<plural>"
  list={<PascalCase>List}
  show={<PascalCase>Show}
  create={<PascalCase>Create}
  edit={<PascalCase>Edit}
  icon={<appropriate-icon>}
/>
```

6. Add sidebar nav item following the existing pattern.

7. Print summary:
```
✅ Resource "<plural>" scaffolded:

| File | Path |
|------|------|
| List View | src/components/atomic-crm/<plural>/<PascalCase>List.tsx |
| Show View | src/components/atomic-crm/<plural>/<PascalCase>Show.tsx |
| Create Form | src/components/atomic-crm/<plural>/<PascalCase>Create.tsx |
| Edit Form | src/components/atomic-crm/<plural>/<PascalCase>Edit.tsx |
| Index | src/components/atomic-crm/<plural>/index.ts |

Resource registered in app config ✅
Sidebar nav item added ✅

Next: Create the Supabase migration for the <plural> table if it doesn't exist yet.
```

## Notes
- ALWAYS read existing resource patterns before generating — never guess the import paths or component structure
- Use react-admin components: List, Datagrid, TextField, DateField, NumberField, ReferenceField, Show, SimpleShowLayout, Create, Edit, SimpleForm, TextInput, DateInput, NumberInput, ReferenceInput, SelectInput
- Follow the project's TypeScript conventions from CLAUDE.md

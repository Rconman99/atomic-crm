# Pre-Deploy Verification

Run all checks to verify the project is ready for deployment.

## Usage
```
/deploy-check
```

## Instructions

Run each check sequentially. Stop and report on first failure.

### Step 1: Lint
```bash
npx eslint src/ --max-warnings 0 2>&1 || echo "LINT_FAILED"
```

### Step 2: Type Check
```bash
npx tsc --noEmit 2>&1 || echo "TYPECHECK_FAILED"
```

### Step 3: Tests
```bash
npm test -- --watchAll=false 2>&1 || echo "TESTS_FAILED"
```

### Step 4: Build
```bash
npm run build 2>&1 || echo "BUILD_FAILED"
```

### Step 5: Bundle Size Check
```bash
du -sh dist/ 2>/dev/null || du -sh build/ 2>/dev/null || echo "No build output found"
```

### Step 6: Env Vars Check
```bash
# Verify no secrets leaked into the build
grep -r "sk_live\|secret_key\|password" dist/ 2>/dev/null && echo "SECRET_LEAK_DETECTED" || echo "No secrets found in build"
```

### Report
```
🚀 Deploy Check Results:

| Check | Status | Details |
|-------|--------|---------|
| Lint | ✅/❌ | <count> warnings |
| Types | ✅/❌ | <error count> |
| Tests | ✅/❌ | <pass/fail count> |
| Build | ✅/❌ | <build time> |
| Bundle | ℹ️ | <size> |
| Secrets | ✅/❌ | <clean/leaked> |

Verdict: READY TO DEPLOY ✅ / BLOCKED ❌
```

If any check fails, provide specific fix suggestions.

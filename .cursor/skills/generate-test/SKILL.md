---
description: These rule is reponsible for generating tests for components
alwaysApply: true
---

# Generate Test


## When to Use

Trigger this skill when the agent receives instructions like:
-   generate tests for uncovered components
-   which components have no tests?
-   write missing tests
-   add test coverage

## Verify test setup exists

Check that `vitest` and `@testing-library/react` are in `package.json`.
If not, remind the user to install them:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Also check that `vite.config.js` (or `.ts`) includes:

```js
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/setupTests.js',
}
```

And that `src/setupTests.js` contains:

```js
import '@testing-library/jest-dom';
```

---

## Instructions

- The skill should discover uncovered component, by scanning 'src/components' or 'src/pages' folders
- Check whether a `*.test.jsx` file exists in the same folder.
- If the component can not be found, please provide a message such: 'Please component name provided: <component_name>'
- Create `<component_name>.test.jsx` file  if missing based on `.cursor/rules/component-test-writing.md` rule
- If file exists, ask question about what test scenario is missing to the user and generate a test based on the answer



## Output

After writing the test, run it and report results in this format:

```
========================================
  TEST REPORT — ComponentName
========================================
 
Status:   ✅ ALL PASSED  /  ❌ FAILED
 
Passed:   X
Failed:   X
Skipped:  X
 
----------------------------------------
FAILED TESTS (if any):
----------------------------------------
   File: src/components/ComponentName/ComponentName.test.tsx:22
 
----------------------------------------
COVERAGE:
----------------------------------------
========================================
```
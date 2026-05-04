---
name: github-actions-workflow
description: >
  Generate a simple GitHub Actions workflow (`.github/workflows/test.yml`) for a React + Vitest project.
  The workflow should run tests automatically on pushes and pull requests.
---

# GitHub Actions Workflow

## Instructions

- Create a test workflow at `.github/workflows/test.yml`.
- Trigger the workflow on:
  - pushes
  - pull requests targeting `*/main` or `*/release`
- The workflow must run the project's test command (Vitest).
# Contributing to AI-Assured Compliance Dashboard

Welcome to the **AI-Assured Compliance Dashboard** developer contribution guidelines. This document outlines coding standards, Git workflow rules, and formatting conventions required to maintain codebase quality.

---

## 1. Coding Standards

### 1.1 TypeScript Configuration

The codebase enforces strict TypeScript checks. Ensure your code follows these policies:

- **No Implicit Any**: Explicitly type all variables, function arguments, and return types. Use of `any` is prohibited. If a type is unknown, use `unknown`.
- **Type Imports**: Prefer `import type` for importing TypeScript types or interfaces to optimize bundle sizes.
- **Strict Null Checks**: Always handle possible `null` or `undefined` returns explicitly (e.g., when querying databases via Prisma).

### 1.2 Linting & Formatting

We use **ESLint** and **Prettier** to enforce consistent style. Coding styles are checked automatically before every commit via pre-commit Git hooks (Husky + lint-staged).

- **Prettier Configuration (`.prettierrc`)**:
  - Semicolons: Required (`"semi": true`)
  - Quotes: Double quotes (`"singleQuote": false`)
  - Indentation: 2 spaces (`"tabWidth": 2`)
  - Line Length: Max 100 characters (`"printWidth": 100`)
  - Trailing Commas: ES5-compatible trailing commas (`"trailingComma": "all"`)
  - Arrow Function Parentheses: Always include (`"arrowParens": "always"`)
  - Line Endings: Unix line endings (`"endOfLine": "lf"`)
- **Commands**:
  - Verify lint rules: `pnpm lint`
  - Apply style formatting: `pnpm format`
  - Check type compiler: `pnpm type-check`

---

## 2. Git Workflow & Collaboration

### 2.1 Branching Strategy

Our branching model relies on structured feature branches that merge into intermediate stages before reaching production.

- `main`: The production-ready branch. Contains the live stable build.
- `dev`: The main integration branch. All active development branches sprout from and merge back into `dev`.
- **Feature Branches**: Branch names must follow a standard naming convention:
  - New features: `feat/<developer-initials>/<short-description>` (e.g., `feat/vi/evidence-vault-upload`)
  - Bug fixes: `fix/<developer-initials>/<short-description>` (e.g., `fix/vi/login-rate-limiter`)
  - Refactoring/Chores: `chore/<developer-initials>/<short-description>` (e.g., `chore/vi/husky-setup`)

### 2.2 Pull Request (PR) Requirements

Before a PR is merged into `dev` or `main`, it must meet the following gates:

1.  **Code Owner Approval**:
    - Merges to `dev` require at least **1 peer review approval**.
    - Merges from `dev` to `main` require at least **2 approvals** from the engineering leads.
2.  **CI Checks**:
    - All automated unit tests must pass (`pnpm test`).
    - All Playwright end-to-end integration tests must pass (`pnpm test:e2e`).
    - Type checking must pass without warnings or errors.
    - Bundle size check must satisfy standard performance allocations.
3.  **Merge Convention**: Branches should be merged using **Squash and Merge** to keep the Git history clean and linear.

---

## 3. Conventional Commit Guidelines

Commit messages must follow the **Conventional Commits** specification. This format allows automated release notes and semantic versioning triggers.

### 3.1 Format

```
<type>(<scope>): <short description>

[Optional body explaining details]

[Optional footer referencing issues]
```

### 3.2 Commit Types

Use one of the following types:

- `feat`: A new feature implementation.
- `fix`: A bug fix.
- `docs`: Documentation changes only (e.g., editing `API.md`).
- `style`: Changes that do not affect code logic (formatting, missing semicolons, white-spaces).
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `perf`: Performance improvement modifications.
- `test`: Adding or correcting tests.
- `chore`: Maintenance updates, dependencies updates, or build scripts configurations.

### 3.3 Examples

- **Commit Feature**:
  ```
  feat(auth): integrate Redis sliding-window rate limiter for login route
  ```
- **Commit Bug Fix**:
  ```
  fix(evidence): validate file magic-bytes for text/csv upload streams
  ```
- **Commit Chore**:
  ```
  chore(deps): upgrade prisma package version to v7.4.1
  ```

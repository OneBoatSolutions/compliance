#!/usr/bin/env node
/**
 * Run Lighthouse CI using lighthouserc.json (URLs configured there).
 *
 * Usage:
 *   pnpm build && pnpm start   # terminal 1
 *   pnpm test:perf:lighthouse  # terminal 2
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["exec", "lhci", "autorun"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    LHCI_BUILD_CONTEXT__CURRENT_HASH: process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH ?? "local",
  },
});

process.exit(result.status ?? 1);

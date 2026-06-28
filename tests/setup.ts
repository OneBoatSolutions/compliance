import { vi } from "vitest";

vi.mock("next/cache", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unstable_cache: (fn: any) => fn,
  revalidateTag: vi.fn(),
}));

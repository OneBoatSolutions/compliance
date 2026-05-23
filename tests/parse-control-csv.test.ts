import { describe, expect, it } from "vitest";

import { parseControlCsvText } from "@/lib/csv/parse-control-csv";

const header = "code,title,description,category,severity,weight";

describe("parseControlCsvText", () => {
  it("flags rows with missing required fields", () => {
    const csv = `${header}
AC-1,,Missing title,Access,HIGH,1`;

    const { rows } = parseControlCsvText(csv);

    expect(rows).toHaveLength(1);
    expect(rows[0].errors.length).toBeGreaterThan(0);
    expect(rows[0].data).toBeUndefined();
  });

  it("rejects invalid severity instead of defaulting", () => {
    const csv = `${header}
AC-2,Access Control,Description text,Access,URGENT,1`;

    const { rows } = parseControlCsvText(csv);

    expect(rows[0].errors.join(" ")).toMatch(/severity/i);
  });

  it("accepts a fully valid row", () => {
    const csv = `${header}
AC-3,Access Control,Description text,Access,HIGH,2`;

    const { rows, fileError } = parseControlCsvText(csv);

    expect(fileError).toBeUndefined();
    expect(rows[0].errors).toHaveLength(0);
    expect(rows[0].data).toMatchObject({
      code: "AC-3",
      severity: "HIGH",
      weight: 2,
    });
  });
});

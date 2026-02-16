import { describe, expect, it } from "vitest";
import { isExportPayloadV1 } from "./validators";

describe("isExportPayloadV1", () => {
  it("accetta un payload v1 valido", () => {
    const payload = {
      version: 1,
      exportedAt: Date.now(),
      credits: 10,
      tasks: [
        {
          id: "1",
          title: "Titolo",
          description: "Desc",
          status: "TODO",
          priority: "LOW",
        },
      ],
      auditEvents: [],
      welcomeSeen: true,
    };

    expect(isExportPayloadV1(payload)).toBe(true);
  });

  it("rifiuta version diversa da 1", () => {
    const payload = {
      version: 2,
      exportedAt: Date.now(),
      credits: 10,
      tasks: [],
    };

    expect(isExportPayloadV1(payload)).toBe(false);
  });
});

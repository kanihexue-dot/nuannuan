import { describe, expect, it } from "vitest";
import { parseCliArgs } from "../cli-args.mjs";

describe("parseCliArgs", () => {
  it("parses named options and positional arguments separately", () => {
    const args = parseCliArgs(["--vault-root", "/tmp/vault", "legacy-path"]);

    expect(args.get("--vault-root")).toBe("/tmp/vault");
    expect(args.positional).toEqual(["legacy-path"]);
  });

  it("rejects an option without a value", () => {
    expect(() => parseCliArgs(["--vault-root"])).toThrow("Missing value for --vault-root");
    expect(() => parseCliArgs(["--input", "--vault-root", "/tmp/vault"])).toThrow(
      "Missing value for --input",
    );
  });
});

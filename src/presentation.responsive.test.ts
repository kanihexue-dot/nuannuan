/// <reference types="vite/client" />

import { describe, expect, it } from "vitest";
import presentationCss from "./styles/presentation.css?raw";

describe("presentation responsive CSS", () => {
  it("keeps the horizontal layout at 1280px and defers stacking to a narrower breakpoint", () => {
    const css = presentationCss;
    const wideBlockStart = css.indexOf("@media (max-width: 1280px)");
    const stackedBlockStart = css.indexOf("@media (max-width: 1100px)");
    const mobileBlockStart = css.indexOf("@media (max-width: 900px)");

    expect(wideBlockStart).toBeGreaterThan(-1);
    expect(stackedBlockStart).toBeGreaterThan(-1);
    expect(mobileBlockStart).toBeGreaterThan(stackedBlockStart);

    const wideBlock = css.slice(wideBlockStart, stackedBlockStart);
    const stackedBlock = css.slice(stackedBlockStart, mobileBlockStart);

    expect(wideBlock).toContain(".app-shell");
    expect(wideBlock).toContain(".presentation-grid");
    expect(wideBlock).toContain("minmax(0, 700px) minmax(300px, 380px)");
    expect(stackedBlock).toContain(".presentation-grid");
    expect(stackedBlock).toContain("grid-template-columns: 1fr");
    expect(stackedBlock).toContain(".narrative-card");
  });
});

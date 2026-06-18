import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnnotationPrdPage } from "./pages/AnnotationPrdPage";

describe("AnnotationPrdPage", () => {
  it("focuses the cloned page on the first-open static screenshot explanation", () => {
    render(<AnnotationPrdPage />);

    expect(screen.getByRole("heading", { name: "首开静态截图标注页" })).toBeInTheDocument();
    expect(
      screen.getByText("只聚焦首次打开这一页，把截图说明、功能标注和讲解口径整理在同一页。")
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "上半图标注说明" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "下半图标注说明" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "上半图：进入与场景" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "下半图：选择与继续" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "内心天气选择区" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "选择反馈与继续区" })).toBeInTheDocument();
  });
});

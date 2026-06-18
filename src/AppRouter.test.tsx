import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AppRouter from "./AppRouter";

afterEach(() => {
  window.location.hash = "";
});

describe("AppRouter", () => {
  it("serves the user-facing phone simulation at the root route", () => {
    window.location.hash = "";

    render(<AppRouter />);

    expect(screen.getByLabelText("手机内交互演示")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "极速破冰" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "五步流程" })).not.toBeInTheDocument();
  });

  it("keeps the first-open page on its dedicated route", () => {
    window.location.hash = "#/first-open";

    render(<AppRouter />);

    expect(
      screen.getByText("如果一时还说不清，就先选一个最像你现在的内心天气。")
    ).toBeInTheDocument();
  });

  it("renders the cloned annotation PRD page on the dedicated route", () => {
    window.location.hash = "#/annotation-prd";

    render(<AppRouter />);

    expect(screen.getByRole("heading", { name: "首开静态截图标注页" })).toBeInTheDocument();
    expect(
      screen.getByText("只聚焦首次打开这一页，把截图说明、功能标注和讲解口径整理在同一页。")
    ).toBeInTheDocument();
  });
});

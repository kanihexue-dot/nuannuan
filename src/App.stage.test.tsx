import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("user-facing phone layout", () => {
  it("shows only the phone simulation without presentation scaffolding", () => {
    render(<App />);

    expect(screen.queryByLabelText("汇报提示框")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "五步流程" })).not.toBeInTheDocument();
    expect(screen.queryByText("Step Notes")).not.toBeInTheDocument();
    expect(screen.getByLabelText("手机内交互演示")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "极速破冰" })).toBeInTheDocument();
    expect(screen.getByAltText("极速破冰 场景演示图")).toHaveAttribute(
      "src",
      "/emotion-scenes/1.png"
    );
  });
});

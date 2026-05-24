import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("presentation layout", () => {
  it("shows the blank note frame, safety rail, and current stage content", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByLabelText("汇报提示框")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "极致共情回应" })).toBeInTheDocument();
    expect(screen.getByText("L0 温和陪伴")).toBeInTheDocument();
    expect(screen.getByText("L3 紧急分流")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "04 视觉治愈与转化" }));

    expect(screen.getByRole("heading", { name: "视觉治愈与转化" })).toBeInTheDocument();
    expect(screen.getByText("通过空间和光把情绪慢慢带离高压。")).toBeInTheDocument();
  });
});

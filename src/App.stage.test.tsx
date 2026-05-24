import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("presentation layout", () => {
  it("shows the blank note frame, safety rail, and current stage content", async () => {
    const user = userEvent.setup();

    render(<App />);

    const safetyRail = screen.getByText("Safety Rail").closest("aside");
    expect(safetyRail).not.toBeNull();

    expect(screen.getByLabelText("汇报提示框")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "极致共情回应" })).toBeInTheDocument();
    expect(screen.getByText("L0 温和陪伴")).toBeInTheDocument();
    expect(screen.getByText("L3 紧急分流")).toBeInTheDocument();
    expect(screen.getByText("L2/L3 仅在检测到更高风险信号时激活，当前演示默认停留在低压场景。")).toBeInTheDocument();
    expect(screen.getByText("不分析，不说教。")).toBeInTheDocument();
    expect(safetyRail?.querySelector('li[data-active="true"]')).toHaveTextContent("L1 加强安抚");

    await user.click(screen.getByRole("button", { name: "04 视觉治愈与转化" }));

    expect(screen.getByRole("heading", { name: "视觉治愈与转化" })).toBeInTheDocument();
    expect(screen.getByText("通过空间和光把情绪慢慢带离高压。")).toBeInTheDocument();
    expect(screen.getByText("不靠说理完成变化。")).toBeInTheDocument();
    expect(screen.queryByText("不分析，不说教。")).not.toBeInTheDocument();
    expect(safetyRail?.querySelector('li[data-active="true"]')).toHaveTextContent("L0 温和陪伴");
  });
});

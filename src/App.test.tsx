import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the presentation shell heading, step buttons, and closing statement", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "小情绪房间" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "01 极速破冰" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "02 隐性感知识别" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "03 极致共情回应" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "04 视觉治愈与转化" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "05 留白沉淀与隐私封存" })).toBeInTheDocument();
    expect(
      screen.getByText("前台体验始终低压力，后台独立守住安全红线。")
    ).toBeInTheDocument();
  });
});

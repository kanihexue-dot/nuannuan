import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("stage mood switching", () => {
  it("switches the mood data attribute and portrait image with the active step", async () => {
    const user = userEvent.setup();
    render(<App />);

    const stage = screen.getByTestId("stage-canvas");
    expect(stage).toHaveAttribute("data-mood", "entry");
    expect(screen.getByAltText("极速破冰 场景演示图")).toHaveAttribute(
      "src",
      "/emotion-scenes/1.png"
    );

    await user.click(screen.getByRole("button", { name: "大暴雨" }));
    await user.click(screen.getByRole("button", { name: "烦死了，但我也不知道为什么" }));
    await user.click(screen.getByRole("button", { name: "进入识别过渡" }));
    await user.click(screen.getByRole("button", { name: "继续进入回应" }));

    expect(stage).toHaveAttribute("data-mood", "compassion");
    expect(screen.getByText("暖暖先接住你")).toBeInTheDocument();
    expect(screen.getByAltText("极致共情回应 场景演示图")).toHaveAttribute(
      "src",
      "/emotion-scenes/3.png"
    );
  });
});

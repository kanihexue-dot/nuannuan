import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("stage mood switching", () => {
  it("switches the mood data attribute and keyword chips with the active step", async () => {
    const user = userEvent.setup();
    render(<App />);

    const stage = screen.getByTestId("stage-canvas");
    expect(stage).toHaveAttribute("data-mood", "compassion");
    expect(screen.getByText("被理解")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "04 视觉治愈与转化" }));

    expect(stage).toHaveAttribute("data-mood", "warmth");
    expect(screen.getByText("台灯暖光")).toBeInTheDocument();
  });
});

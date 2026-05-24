import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { presentationSteps } from "../../data/steps";
import { FlowOverview } from "../FlowOverview";

describe("FlowOverview", () => {
  it("renders five steps and reports the selected step", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();

    render(
      <FlowOverview
        steps={presentationSteps}
        activeStepId="step-03"
        onStepChange={onStepChange}
      />
    );

    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "03 极致共情回应" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "05 留白沉淀与隐私封存" }));

    expect(onStepChange).toHaveBeenCalledWith("step-05");
  });
});

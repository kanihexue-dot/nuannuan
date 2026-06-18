import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("opens directly as the user-facing phone app simulation", () => {
    render(<App />);

    expect(screen.getByLabelText("手机内交互演示")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "极速破冰" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "五步流程" })).not.toBeInTheDocument();
    expect(screen.queryByText("Step Notes")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("汇报提示框")).not.toBeInTheDocument();
  });

  it("advances with the primary action button and allows moving back", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "大暴雨" }));
    await user.click(screen.getByRole("button", { name: "我就是有点累，不想解释" }));
    await user.click(screen.getByRole("button", { name: "进入识别过渡" }));
    await user.click(screen.getByRole("button", { name: "继续进入回应" }));
    await user.click(screen.getByRole("button", { name: "继续显示下半句" }));
    await user.click(screen.getByRole("button", { name: "显示完整落点" }));

    await user.click(screen.getByRole("button", { name: "看场景变暖" }));

    expect(screen.getByRole("heading", { name: "视觉治愈与转化" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "封存这一刻" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "上一步" }));

    expect(screen.getByRole("heading", { name: "极致共情回应" })).toBeInTheDocument();
  });

  it("loops back to the first step from the last primary action", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "大暴雨" }));
    await user.click(screen.getByRole("button", { name: "烦死了，但我也不知道为什么" }));
    await user.click(screen.getByRole("button", { name: "进入识别过渡" }));
    await user.click(screen.getByRole("button", { name: "继续进入回应" }));
    await user.click(screen.getByRole("button", { name: "继续显示下半句" }));
    await user.click(screen.getByRole("button", { name: "显示完整落点" }));
    await user.click(screen.getByRole("button", { name: "看场景变暖" }));
    await user.click(screen.getByRole("button", { name: "封存这一刻" }));
    await user.click(screen.getByRole("button", { name: "回到开头" }));

    expect(screen.getByRole("heading", { name: "极速破冰" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "进入识别过渡" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "上一步" })).toBeDisabled();
  });

  it("guides selection, recognition, and staged empathy reveal from step 01 to step 03", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole("button", { name: "进入识别过渡" })).toBeDisabled();
    expect(screen.getByText("先选一个天气，再选或写一句最接近的话。")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "阴天" }));
    await user.click(screen.getByRole("button", { name: "烦死了，但我也不知道为什么" }));

    expect(screen.getByRole("button", { name: "进入识别过渡" })).toBeEnabled();
    expect(screen.getByText("可以了，我们只把这句话温柔地翻译一下。")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "进入识别过渡" }));

    expect(screen.getByRole("heading", { name: "隐性感知识别" })).toBeInTheDocument();
    expect(screen.getByText("识别中")).toBeInTheDocument();
    expect(screen.getByText("细粒度情绪")).toBeInTheDocument();
    expect(screen.getAllByText("天气感受")[0]).toBeInTheDocument();
    expect(screen.getAllByText("阴天")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Mood：烦躁 / 低落")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Emotion：委屈 / 防备 / 不被理解")[0]).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "继续进入回应" }));

    expect(screen.getByRole("heading", { name: "极致共情回应" })).toBeInTheDocument();
    expect(screen.getByText("暖暖先接住你")).toBeInTheDocument();
    expect(screen.getAllByText("外面的雨太大了，进来烤烤火吧。")[0]).toBeInTheDocument();
    expect(screen.queryByText("烦心事都丢给火堆，我先陪你待一会。")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "继续显示下半句" }));

    expect(screen.getByText("烦心事都丢给火堆，我先陪你待一会。")).toBeInTheDocument();
    expect(screen.queryByText("你不用马上变好，先把呼吸放慢一点。")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "显示完整落点" }));

    expect(screen.getByText("你不用马上变好，先把呼吸放慢一点。")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "看场景变暖" })).toBeInTheDocument();
  });

  it("accepts a typed phrase as meaningful input and carries it into recognition", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "起雾" }));

    expect(screen.getByRole("button", { name: "进入识别过渡" })).toBeDisabled();

    await user.type(screen.getByLabelText("也可以自己写一句"), "今天脑子很乱，不想回消息");

    expect(screen.getByRole("button", { name: "进入识别过渡" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "进入识别过渡" }));

    expect(screen.getAllByText("起雾")[0]).toBeInTheDocument();
    expect(screen.getByText("今天脑子很乱，不想回消息")).toBeInTheDocument();
    expect(screen.getAllByText("Mood：混乱 / 低耗能")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Emotion：疲惫 / 回避 / 想被安静接住")[0]).toBeInTheDocument();
  });
});

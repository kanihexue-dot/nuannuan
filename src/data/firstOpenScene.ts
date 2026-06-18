export type FirstOpenWeatherId = "storm" | "fog" | "cloud" | "snow";

export interface FirstOpenWeatherOption {
  id: FirstOpenWeatherId;
  weatherLabel: string;
  weatherHint: string;
  tags: string[];
}

export const firstOpenWeatherOptions: FirstOpenWeatherOption[] = [
  {
    id: "storm",
    weatherLabel: "大暴雨",
    weatherHint: "像是一下子压过来的烦和乱。",
    tags: ["烦死了", "真的会谢", "心态崩了", "太难了"]
  },
  {
    id: "fog",
    weatherLabel: "起大雾",
    weatherHint: "像是看不清、提不起劲，也不想被催。",
    tags: ["好焦虑", "尽力了", "没动力", "让我呆一会"]
  },
  {
    id: "cloud",
    weatherLabel: "阴天乌云",
    weatherHint: "像是胸口闷着一层话，说出来也嫌累。",
    tags: ["无语", "心累", "不想说话", "别管我"]
  },
  {
    id: "snow",
    weatherLabel: "大雪深夜",
    weatherHint: "像是整个人慢下来，只想躲进安静里。",
    tags: ["彻底累了", "一片空白", "难受", "想躲起来"]
  }
];

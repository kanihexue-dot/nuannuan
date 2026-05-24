import type { SafetyLevel } from "../types";

const levels: Array<{ id: SafetyLevel; label: string }> = [
  { id: "L0", label: "L0 温和陪伴" },
  { id: "L1", label: "L1 加强安抚" },
  { id: "L2", label: "L2 风险提示" },
  { id: "L3", label: "L3 紧急分流" }
];

interface SafetyRailProps {
  activeLevel: SafetyLevel;
}

export function SafetyRail({ activeLevel }: SafetyRailProps) {
  return (
    <aside className="safety-rail">
      <p className="safety-rail__eyebrow">Safety Rail</p>
      <ul>
        {levels.map((level) => (
          <li key={level.id} data-active={level.id === activeLevel}>
            {level.label}
          </li>
        ))}
      </ul>
      <p className="safety-rail__note">
        L2/L3 仅在检测到更高风险信号时激活，当前演示默认停留在低压场景。
      </p>
    </aside>
  );
}

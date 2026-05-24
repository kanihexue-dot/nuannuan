const labels = [
  "01 极速破冰",
  "02 隐性感知识别",
  "03 极致共情回应",
  "04 视觉治愈与转化",
  "05 留白沉淀与隐私封存"
];

export default function App() {
  return (
    <main className="app-shell">
      <header className="hero-shell">
        <p className="hero-kicker">Warm Room Demo</p>
        <h1>小情绪房间</h1>
        <p className="hero-subtitle">低摩擦情绪安置演示页</p>
      </header>

      <nav aria-label="五步流程" className="step-shell">
        {labels.map((label) => (
          <button key={label} className="step-button" type="button">
            {label}
          </button>
        ))}
      </nav>

      <footer className="closing-shell">前台体验始终低压力，后台独立守住安全红线。</footer>
    </main>
  );
}

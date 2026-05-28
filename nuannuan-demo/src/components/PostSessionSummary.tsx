export function PostSessionSummary() {
  return (
    <section className="flow-card post-session-card" aria-labelledby="post-session-title">
      <div className="step-label">Step 1 / 刚结束</div>
      <div>
        <p className="eyebrow">聊天 / 情绪房间结束</p>
        <h2 id="post-session-title">刚刚有一段心情被接住了</h2>
        <p className="safe-quote">
          “刚才我有点担心自己是不是打扰到别人，也有点不知道该怎么开口。”
        </p>
        <p className="muted-copy">
          Demo 只展示低风险、已改写过的例子；不会把用户的敏感原文直接放进我的页面。
        </p>
      </div>
    </section>
  )
}

export function SafetyGuidePanel() {
  return (
    <section className="safety-guide" role="status">
      <div className="safety-guide__copy">
        <p className="eyebrow">安全保护</p>
        <h2>有一段内容已进入安全保护模式</h2>
        <p>
          暖暖不会在这里保存或展示具体细节。先把注意力放回当下，
          如果你现在处在现实危险中，请优先联系身边可信任的人或当地紧急服务。
        </p>
      </div>
      <ul className="safety-steps" aria-label="安全引导步骤">
        <li>慢慢吸气 4 秒，再呼气 6 秒，重复几轮。</li>
        <li>给一个可信任的人发消息，告诉对方你现在需要陪伴。</li>
        <li>如果风险正在发生，请立即寻求线下紧急帮助。</li>
      </ul>
    </section>
  )
}

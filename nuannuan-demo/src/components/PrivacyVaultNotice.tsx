interface PrivacyVaultNoticeProps {
  hiddenCount: number
  protectedRiskCount: number
}

export function PrivacyVaultNotice({ hiddenCount, protectedRiskCount }: PrivacyVaultNoticeProps) {
  return (
    <section className="privacy-vault">
      <div>
        <p className="eyebrow">可控的边界</p>
        <h2>隐私封存</h2>
        <p>
          已为你封存 {hiddenCount} 条隐藏小记和 {protectedRiskCount} 条安全保护记录。
          这些内容不会出现在安全小屋首页，也不会被暖暖主动提起。
        </p>
      </div>
      <a className="vault-link" href="#vault" aria-label="进入隐私封存入口">
        查看封存入口
      </a>
    </section>
  )
}

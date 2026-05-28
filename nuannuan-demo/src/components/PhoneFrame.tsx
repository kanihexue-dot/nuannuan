import type { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
  label?: string
}

export function PhoneFrame({ children, label = '暖暖手机闭环 Demo' }: PhoneFrameProps) {
  return (
    <section className="phone-shell" aria-label={label}>
      <div className="phone-hardware">
        <div className="phone-speaker" aria-hidden="true" />
        <div className="phone-screen">{children}</div>
      </div>
    </section>
  )
}

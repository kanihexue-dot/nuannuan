import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

it('plants a mood seed and opens the memory garden as seed cards first', async () => {
  const user = userEvent.setup()
  render(<App />)

  const phone = screen.getByRole('region', { name: '心情小种子记忆花园 Demo' })
  expect(within(phone).getByRole('heading', { name: '今天的心情，变成了一颗小种子' })).toBeInTheDocument()
  expect(within(phone).queryByRole('heading', { name: '三轮对话' })).not.toBeInTheDocument()
  expect(within(phone).queryByText(/刚才我有点担心自己是不是打扰到别人/)).not.toBeInTheDocument()

  expect(within(phone).getByText(/它还没有种下/)).toBeInTheDocument()
  expect(within(phone).getByRole('button', { name: '带去记忆花园' })).toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '带去记忆花园' }))
  expect(within(phone).getByRole('heading', { name: '已经带到小花园啦。' })).toBeInTheDocument()
  expect(within(phone).getByText(/已同步到「我的」里的记忆小花园/)).toBeInTheDocument()
  expect(phone.querySelector('.seed-success-action-video source')).toHaveAttribute(
    'src',
    '/reference-assets/seed-planting-action-overlay-212.m4v',
  )
  expect(phone.querySelector('.seed-success-glow')).not.toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '去我的页面看看' }))
  expect(within(phone).getByRole('heading', { name: '我的页面' })).toBeInTheDocument()
  expect(within(phone).getByText(/陪伴你的第23天/)).toBeInTheDocument()
  expect(within(phone).getByText(/已种下 12 颗/)).toBeInTheDocument()
  expect(within(phone).queryByRole('button', { name: '探索' })).not.toBeInTheDocument()
  expect(phone.querySelector('.reference-my-page-explore-mask')).not.toBeInTheDocument()
  expect(phone.querySelector('.reference-my-page-bottom-layer')).not.toBeInTheDocument()
  expect(phone.querySelector('.reference-my-page-bottom-nav')).not.toBeInTheDocument()
  expect(within(phone).queryByRole('navigation', { name: '底部导航' })).not.toBeInTheDocument()
  expect(within(phone).queryByText('首页')).not.toBeInTheDocument()
  expect(within(phone).queryByText('我的')).not.toBeInTheDocument()
  expect(within(phone).queryByText('探索')).not.toBeInTheDocument()
  expect(within(phone).getByRole('button', { name: '进去看看' })).toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '进去看看' }))
  const garden = within(phone).getByRole('region', { name: '记忆花园第一层' })
  const seedCards = within(garden).getAllByRole('button', { name: /查看.*心情小种子/ })
  expect(seedCards.length).toBeGreaterThanOrEqual(4)
  expect(within(garden).queryByRole('button', { name: /朋友关系|学习压力|家庭沟通|睡眠/ })).not.toBeInTheDocument()

  await user.click(seedCards[0])
  expect(within(phone).getByRole('heading', { name: /小种子详情/ })).toBeInTheDocument()
  expect(within(phone).getByText('暖暖回应')).toBeInTheDocument()
  expect(within(phone).getByText('你留下的话')).toBeInTheDocument()
  expect(within(phone).getByText('关联主题')).toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '回到我的页面' }))
  expect(within(phone).getByRole('heading', { name: '我的页面' })).toBeInTheDocument()
  expect(within(phone).getByRole('button', { name: '进去看看' })).toBeInTheDocument()
})

it('keeps a not-saved mood seed out of the memory garden', async () => {
  const user = userEvent.setup()
  render(<App />)

  const phone = screen.getByRole('region', { name: '心情小种子记忆花园 Demo' })
  await user.click(within(phone).getByRole('button', { name: '先不保存' }))

  expect(within(phone).getByRole('heading', { name: '记忆花园' })).toBeInTheDocument()
  expect(within(phone).getByText(/这颗心情小种子没有保存/)).toBeInTheDocument()
  await user.click(within(phone).getByRole('button', { name: '进入记忆花园' }))

  expect(within(phone).queryByText('刚刚这颗小种子')).not.toBeInTheDocument()
})

it('keeps image-background navigation controls functional', async () => {
  const user = userEvent.setup()
  render(<App />)

  const phone = screen.getByRole('region', { name: '心情小种子记忆花园 Demo' })

  await user.click(within(phone).getByRole('button', { name: '返回种子结果页' }))
  expect(within(phone).getByRole('heading', { name: '今天的心情，变成了一颗小种子' })).toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '带去记忆花园' }))
  expect(within(phone).getByRole('heading', { name: '已经带到小花园啦。' })).toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '返回种子结果页' }))
  expect(within(phone).getByRole('heading', { name: '今天的心情，变成了一颗小种子' })).toBeInTheDocument()
})

it('handles My Page top controls without leaving the reference page', async () => {
  const user = userEvent.setup()
  render(<App />)

  const phone = screen.getByRole('region', { name: '心情小种子记忆花园 Demo' })
  await user.click(within(phone).getByRole('button', { name: '带去记忆花园' }))
  await user.click(within(phone).getByRole('button', { name: '去我的页面看看' }))

  await user.click(within(phone).getByRole('button', { name: '打开页面工具' }))
  expect(within(phone).getByText(/页面工具已打开/)).toBeInTheDocument()
  expect(within(phone).getByRole('heading', { name: '我的页面' })).toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '打开设置' }))
  expect(within(phone).getByText(/设置已打开/)).toBeInTheDocument()
  expect(within(phone).getByRole('heading', { name: '我的页面' })).toBeInTheDocument()
})

it('does not expose high risk details or old mainline terms in rendered UI', () => {
  render(<App />)

  expect(screen.queryByText(/三轮对话|固定三轮对话|整理成心情小种子/)).not.toBeInTheDocument()
  expect(screen.queryByText(/self_harm_signal|hopelessness_signal/)).not.toBeInTheDocument()
  expect(screen.queryByText(/小火光|记忆小花园|删除|隐藏|封存日记/)).not.toBeInTheDocument()
})

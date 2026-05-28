import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

it('plants a mood seed and opens the memory garden as seed cards first', async () => {
  const user = userEvent.setup()
  render(<App />)

  const phone = screen.getByRole('region', { name: '心情小种子记忆花园 Demo' })
  expect(within(phone).getByRole('heading', { name: '三轮对话' })).toBeInTheDocument()
  expect(within(phone).queryByRole('heading', { name: '心情小种子' })).not.toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '整理成心情小种子' }))
  expect(within(phone).getByRole('heading', { name: '心情小种子' })).toBeInTheDocument()
  expect(within(phone).getByText(/暖暖把这三轮对话整理成了一颗心情小种子/)).toBeInTheDocument()
  expect(within(phone).getByRole('button', { name: '带去记忆花园' })).toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '带去记忆花园' }))
  expect(within(phone).getByRole('heading', { name: '记忆花园' })).toBeInTheDocument()
  expect(within(phone).getByText(/刚刚种下/)).toBeInTheDocument()

  await user.click(within(phone).getByRole('button', { name: '进入记忆花园' }))
  const garden = within(phone).getByRole('region', { name: '记忆花园第一层' })
  const seedCards = within(garden).getAllByRole('button', { name: /查看.*心情小种子/ })
  expect(seedCards.length).toBeGreaterThanOrEqual(4)
  expect(within(garden).queryByRole('button', { name: /朋友关系|学习压力|家庭沟通|睡眠/ })).not.toBeInTheDocument()

  await user.click(seedCards[0])
  expect(within(phone).getByRole('heading', { name: /小种子详情/ })).toBeInTheDocument()
  expect(within(phone).getByText('暖暖回应')).toBeInTheDocument()
  expect(within(phone).getByText('你留下的话')).toBeInTheDocument()
  expect(within(phone).getByText('关联主题')).toBeInTheDocument()
})

it('keeps a not-saved mood seed out of the memory garden', async () => {
  const user = userEvent.setup()
  render(<App />)

  const phone = screen.getByRole('region', { name: '心情小种子记忆花园 Demo' })
  await user.click(within(phone).getByRole('button', { name: '整理成心情小种子' }))
  await user.click(within(phone).getByRole('button', { name: '先不保存' }))

  expect(within(phone).getByRole('heading', { name: '记忆花园' })).toBeInTheDocument()
  expect(within(phone).getByText(/这颗心情小种子没有保存/)).toBeInTheDocument()
  await user.click(within(phone).getByRole('button', { name: '进入记忆花园' }))

  expect(within(phone).queryByText('刚刚这颗小种子')).not.toBeInTheDocument()
})

it('does not expose high risk details or old mainline terms in rendered UI', () => {
  render(<App />)

  expect(screen.getByText(/高风险内容不会进入普通记忆花园/)).toBeInTheDocument()
  expect(screen.queryByText(/self_harm_signal|hopelessness_signal/)).not.toBeInTheDocument()
  expect(screen.queryByText(/小火光|记忆小花园|删除|隐藏|封存日记/)).not.toBeInTheDocument()
})

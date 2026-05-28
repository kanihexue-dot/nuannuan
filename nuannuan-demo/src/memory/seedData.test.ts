import { createDemoState } from './seedData'

it('provides a pending mood seed and several planted normal garden seeds', () => {
  const state = createDemoState()

  expect(state.currentSeed.gardenStatus).toBe('pending')
  expect(state.garden.seeds.length).toBeGreaterThanOrEqual(4)
  expect(new Set(state.garden.seeds.map((seed) => seed.seedColor)).size).toBeGreaterThanOrEqual(4)
})

it('keeps protected high risk content out of regular garden seeds', () => {
  const state = createDemoState()
  const renderedSeedText = state.garden.seeds.map((seed) => seed.summary).join('\n')

  expect(renderedSeedText).not.toMatch(/self_harm_signal/)
  expect(state.garden.seeds.some((seed) => seed.riskLevel === 'high')).toBe(false)
  expect(state.seeds.some((seed) => seed.riskLevel === 'high')).toBe(true)
})

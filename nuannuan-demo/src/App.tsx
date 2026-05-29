import { useMemo } from 'react'
import { SeedGardenDemo } from './components/SeedGardenDemo'
import { createDemoState } from './memory/seedData'
import './styles.css'

function App() {
  const initialState = useMemo(() => createDemoState(), [])

  return (
    <SeedGardenDemo
      initialSeeds={initialState.seeds}
      seedCandidate={initialState.currentSeedCandidate}
    />
  )
}

export default App

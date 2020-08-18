import React from 'react'

import SearchLocation from './Components/SearchLocation/SearchLocation'
import { Location } from './Types/Location'
import WeekPredictions from './Components/WeekPredictions/WeekPredictions'

import './App.css'

function App () {
  const [location, setLocation] = React.useState<Location | null>(null)
  return (
    <div className='app'>
      <SearchLocation onSelectLocation={setLocation} location={location} />
      {location && <WeekPredictions location={location} />}
    </div>
  )
}

export default App

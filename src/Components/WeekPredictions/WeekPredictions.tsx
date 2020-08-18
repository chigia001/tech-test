import React from 'react'
import { CircularProgress } from '@material-ui/core'

import { Prediction } from '../../Types/Prediction'
import { Location } from '../../Types/Location'
import { getLocationDetails } from '../../Fetches/weatherFetchs'

import './WeekPredictions.css'
import DayPrediction from './DayPrediction'

const formatIso = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0]

const WeekPredictions: React.FC<{ location: Location }> = ({ location }) => {
  const [predictionMap, setPredictionMap] = React.useState<Record<string, Prediction> | undefined>(undefined)

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const locationDetails = await getLocationDetails(location.woeid)
      if (!cancelled) {
        setPredictionMap(
          Object.fromEntries(
            locationDetails.consolidated_weather.map((prediction) => [
              prediction.applicable_date,
              prediction
            ])
          )
        )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [location.woeid])

  return (
    <div className="weekPridiction">
      {!predictionMap ? (
        <CircularProgress color="inherit" size={20} />
      ) : (
        [...new Array(7)].map((_, index) => {
          const date = new Date(Date.now())
          date.setDate(date.getDate() + index)
          const dateS = formatIso(date)
          return (
            <DayPrediction
              date={dateS}
              key={dateS}
              prediction={predictionMap[dateS]}
            />
          )
        })
      )}
    </div>
  )
}

export default React.memo(WeekPredictions)

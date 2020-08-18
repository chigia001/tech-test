import React, { CSSProperties } from 'react'
import HelpIcon from '@material-ui/icons/Help'

import { Prediction } from '../../Types/Prediction'

import './DayPrediction.css'

const formatWeekDay = Intl.DateTimeFormat('en', {
  weekday: 'long'
})

const DayPrediction: React.FC<{ date: string, prediction?: Prediction }> = ({
  date,
  prediction
}) => {
  return (
    <div
      className="dayPrediction"
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      style={{ '--imageSize': '90px' } as CSSProperties}
    >
      <div>{formatWeekDay.format(new Date(date))}</div>
      {prediction ? (
        <img
          className="dayPrediction__weatherState"
          src={`https://www.metaweather.com/static/img/weather/${prediction.weather_state_abbr}.svg`}
          title={prediction.weather_state_name}
          alt={prediction.weather_state_name}
        />
      ) : (
        <HelpIcon className="dayPrediction__unknownWeatherState" />
      )}
      <div>Min: {prediction?.min_temp.toFixed(1) ?? '?'}°C</div>
      <div>Max: {prediction?.max_temp.toFixed(1) ?? '?'}°C</div>
    </div>
  )
}

export default React.memo(DayPrediction)

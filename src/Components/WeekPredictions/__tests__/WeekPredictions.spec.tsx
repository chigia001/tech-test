/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { render, act } from '@testing-library/react'

import React from 'react'

import { LocationDetail } from '../../../Types/LocationDetails'
import WeekPredictions from '../WeekPredictions'

describe('WeekPredictions', () => {
  const originalNow = globalThis.Date.now
  const originalFetch = globalThis.fetch
  let mockFetch: jest.Mock
  let mockNow: jest.Mock
  beforeAll(() => {
    mockNow = globalThis.Date.now = jest.fn(() => new Date('2020-08-08').valueOf())
    mockFetch = globalThis.fetch = jest.fn(
      async () =>
        ({
          ok: true,
          json: async (): Promise<LocationDetail> => ({
            title: 'hcm',
            latt_long: 'latt_long',
            location_type: 'City',
            consolidated_weather: [
              {
                id: 1,
                applicable_date: '2020-08-08',
                min_temp: 30,
                max_temp: 35,
                weather_state_abbr: 'sn',
                weather_state_name: 'Snow'
              },
              {
                id: 2,
                applicable_date: '2020-08-09',
                min_temp: 30,
                max_temp: 35,
                weather_state_abbr: 'sl',
                weather_state_name: 'Sleet'
              },
              {
                id: 3,
                applicable_date: '2020-08-10',
                min_temp: 30,
                max_temp: 35,
                weather_state_abbr: 'h',
                weather_state_name: 'Hail'
              },
              {
                id: 4,
                applicable_date: '2020-08-11',
                min_temp: 30,
                max_temp: 35,
                weather_state_abbr: 't',
                weather_state_name: 'Thunderstorm'
              },
              {
                id: 5,
                applicable_date: '2020-08-12',
                min_temp: 30,
                max_temp: 35,
                weather_state_abbr: 'hr',
                weather_state_name: 'Heavy Rain'
              },
              {
                id: 6,
                applicable_date: '2020-08-13',
                min_temp: 30,
                max_temp: 35,
                weather_state_abbr: 'c',
                weather_state_name: 'Clear'
              }
            ]
          })
        } as Response)
    )
  })
  afterAll(() => {
    globalThis.fetch = originalFetch
    global.Date.now = originalNow
  })
  beforeEach(() => {
    mockFetch.mockClear()
    mockNow.mockClear()
  })
  describe('week Prediction', () => {
    it('should match snapshot', async () => {
      const { container } = render(
        <WeekPredictions
          location={{
            woeid: 123,
            title: 'hcm',
            latt_long: 'latt_long',
            location_type: 'City'
          }}
        />
      )

      await act(async () => await new Promise((resolve) => resolve()))
      expect(container).toMatchSnapshot()
    })
    it('should call fetch with correct params', async () => {
      render(
        <WeekPredictions
          location={{
            woeid: 123,
            title: 'hcm',
            latt_long: 'latt_long',
            location_type: 'City'
          }}
        />
      )

      await act(async () => await new Promise((resolve) => resolve()))
      expect(mockFetch.mock.calls.length).toBe(1)
      expect(mockFetch.mock.calls[0][0]).toBe('/api/location/123/')
    })
  })
})

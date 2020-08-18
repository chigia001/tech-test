import React from 'react'
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor
} from '@testing-library/react'

import SearchLocation from '../SearchLocation'
import { Location } from '../../../Types/Location'

describe('SearchLocation', () => {
  const originalFetch = globalThis.fetch
  let mockFetch: jest.Mock

  const FAKE_LOCATION: Location = {
    woeid: 123,
    title: 'Ho Chi Minh City',
    location_type: 'City',
    latt_long: '123,123'
  }
  afterAll(() => {
    globalThis.fetch = originalFetch
  })
  beforeAll(() => {
    global.document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      // @ts-expect-error
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document
      }
    })

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    mockFetch = global.fetch = jest.fn(
      async () =>
        ({
          ok: true,
          json: async (): Promise<Location[]> => [FAKE_LOCATION]
        } as Response)
    )
  })
  const setUp = () => {
    const onSelectLocation = jest.fn()
    const utils = render(
      <SearchLocation location={null} onSelectLocation={onSelectLocation} />
    )

    const input = utils.getByLabelText('Search location')

    return {
      utils,
      onSelectLocation,
      input,
      updateInput: (value: string) => {
        fireEvent.input(input, {
          target: {
            value
          }
        })
      }
    }
  }
  it('only show dropdown when input have more than 3 chars', async () => {
    const { utils, input, updateInput } = setUp()
    updateInput('12')
    expect(input.value).toBe('12')
    expect(utils.queryAllByRole('presentation')).toHaveLength(0)

    updateInput('123')
    expect(input.value).toBe('123')
    expect(utils.getByRole('presentation')).toBeInTheDocument()
  })

  it('should debounce call api when input is update rapidly', async () => {
    const { onSelectLocation, utils, input, updateInput } = setUp()

    updateInput('Ho ')

    expect(input.value).toBe('Ho ')
    expect(utils.getByRole('presentation')).toBeInTheDocument()
    expect(mockFetch).not.toBeCalled()
    fireEvent.input(input, {
      target: {
        value: 'Ho Chi '
      }
    })
    fireEvent.input(input, {
      target: {
        value: 'Ho Chi M'
      }
    })
    await waitForElementToBeRemoved(() => utils.queryByText('Loading…'))
    expect(mockFetch).toBeCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      `/api/location/search/?query=${encodeURIComponent('Ho Chi M')}`
    )
    await waitFor(() => {
      expect(utils.getByText('Ho Chi Minh City')).toBeInTheDocument()
    })

    fireEvent.click(utils.getByText('Ho Chi Minh City'))

    expect(onSelectLocation).toBeCalledWith(FAKE_LOCATION)
  })

  it('should show loading select if more than 3 char input', async () => {
    const { utils, input, updateInput } = setUp()
    updateInput('Ho Chi')

    expect(input.value).toBe('Ho Chi')
    expect(utils.getByRole('presentation')).toBeInTheDocument()
    expect(utils.getByText('Loading…')).toBeInTheDocument()
  })

  it('should trigger onSelectLocation when click on item', async () => {
    const { onSelectLocation, utils, updateInput } = setUp()
    updateInput('Ho Chi')

    await waitForElementToBeRemoved(() => utils.queryByText('Loading…'))
    await waitFor(() => {
      expect(utils.getByText('Ho Chi Minh City')).toBeInTheDocument()
    })

    fireEvent.click(utils.getByText('Ho Chi Minh City'))

    expect(onSelectLocation).toBeCalledWith(FAKE_LOCATION)
  })
})

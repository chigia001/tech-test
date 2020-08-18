import React, { ChangeEvent } from 'react'

import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'

import { Location } from '../../Types/Location'

import { useSearchState } from './useSearchState'
import { useHandler } from './useHandler'

type OnSelectLocation = (location: Location | null) => void

const getLocationName = (option: Location): string => option.title
const checkLocationSelected = (option: Location, value: Location) =>
  option.woeid === value.woeid
const SearchLocation: React.FC<{
  location: Location | null
  onSelectLocation: OnSelectLocation
}> = ({ onSelectLocation, location }) => {
  const [{
    input,
    showLocations,
    isLoading,
    locations
  },
  dispatch
  ] = useSearchState(location)
  const { onChange, open, close } = useHandler(dispatch)

  const onSelectLocationWrapper = React.useCallback(
    (e: ChangeEvent<{}>, location: Location | null) => {
      onSelectLocation(location)
    },
    [onSelectLocation]
  )
  return (
    <Autocomplete
      style={{ width: 300 }}
      size="small"
      open={showLocations}
      onOpen={open}
      onClose={close}
      clearOnBlur={false}
      getOptionLabel={getLocationName}
      getOptionSelected={checkLocationSelected}
      options={locations}
      loading={isLoading}
      inputValue={input}
      onInput={onChange}
      value={location}
      onChange={onSelectLocationWrapper}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search location"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  )
}

export default React.memo(SearchLocation)

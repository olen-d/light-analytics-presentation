import { useEffect, useState } from 'react'

import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

const SelectGeneric = (
  {
    errors,
    handleBlur,
    handleChange,
    helperText = 'Please enter valid text',
    id = 'select-generic',
    initialValue = 'forever',
    inputName = 'multilineGeneric',
    labelId = 'select-generic-label',
    labeltext = 'Generic Select',
    options,
    placeholder, 
    required = false,
    values
  }) => {
  
    const [period, setPeriod] = useState('')

    useEffect(() => {
      setPeriod(initialValue)
    }, [initialValue])

    return (
      <FormControl fullWidth>
        <InputLabel id={labelId}>{labeltext}</InputLabel>
        <Select
          labelId={labelId}
          id={id}
          value={period}
          label={labeltext}
          onChange={handleChange}
        >
          {options.map(element => {
            return (
              <MenuItem value={element.value} key={element.value}>
                {element.label}
              </MenuItem>
              )
            })
          }
        </Select>
      </FormControl>
    )
  }

  export default SelectGeneric

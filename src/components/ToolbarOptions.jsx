import { useState } from 'react'

import { PropTypes } from 'prop-types'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

const ToolbarOptions = ({
  direction = 'row',
  handleClick,
  options,
  spacing = 2,
  variant = 'text'
}) => {
  return (
    <Stack spacing={spacing} direction={direction}>
      {
        options.map(element => {
          return (
            <Button
              key={element.id}
              onClick={() => {handleClick(element.value)}}
              size="small"
              style={{ color: '#0d47a1' }}
              variant={variant}
            >
              {element.option}
            </Button>
          )
        })
      }
    </Stack>
  )
}

const { array, number, string } = PropTypes

ToolbarOptions.propTypes = {
  direction: string,
  options: array,
  spacing: number
}

export default ToolbarOptions

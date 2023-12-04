import { useState } from 'react'

import PropTypes from 'prop-types'

import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@mui/material'

import { Visibility, VisibilityOff } from '@mui/icons-material'

const InputPassword = (
  { 
    errors,
    handleBlur,
    handleChange,
    helperText = 'Please enter a valid password',
    inputName = 'passwordPlaintext',
    labeltext = 'Password',
    placeholder, 
    required = false,
    values
  }) => {

  const [ showPassword, setShowPassword ] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const isError = event => {
    const { target: { name }, } = event

    const oneUpper = /[A-Z]/
    const oneLower = /[a-z]/
    const oneDigit = /\d/
    const oneSpecial = /[!@#$%^&*()-+=]/

    const isOneUpper = oneUpper.test(values[name])
    const isOneLower = oneLower.test(values[name])
    const isOneDigit = oneDigit.test(values[name])
    const isOneSpecial = oneSpecial.test(values[name])
    const isLength = values[name]?.length >= 8

    if (
      isOneUpper &&
      isOneLower &&
      (isOneDigit || isOneSpecial) &&
      isLength
    ) {
      return false
    } else {
      return true
    }
  }

  return(
    <>
      <FormControl error={errors[inputName]} required={required} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          error={errors[inputName]}
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          name={inputName}
          label={labeltext}
          placeholder={placeholder}
          value={values[inputName] || ""}
          onBlur={(event) => handleBlur(isError(event), event)}
          onChange={handleChange}
        />
         <FormHelperText id="outlined-weight-helper-text">{errors[inputName] ? helperText: " "}</FormHelperText>
      </FormControl>
    </>
  )
}

const { bool, func, object, string } = PropTypes

InputPassword.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  helperText: string,
  inputName: string,
  labeltext: string,
  placeholder: string,
  required: bool,
  values: object
}

export default InputPassword

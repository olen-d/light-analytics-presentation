import PropTypes from 'prop-types'

import { TextField } from '@mui/material'

const InputUsername = (
  { 
    errors,
    handleBlur,
    handleChange,
    helperText = 'Please enter a valid username',
    inputName = 'username',
    labeltext = 'Username',
    placeholder, 
    required = false,
    values
  }) => {

  const isError = event => {
    const { target: { name }, } = event

    const alphaNumeric = /^[a-z0-9]+(?:[-_.+]?[a-z0-9]+)*$/
    const isValid = values[name] && alphaNumeric.test(values[name])
    return !isValid
  }

  return(
    <>
      <TextField
        error={errors[inputName] }
        helperText={errors[inputName] ? helperText : null }
        label={labeltext}
        inputProps={{ autoCapitalize: "off", autoCorrect: "off" }}
        name={inputName}
        placeholder={placeholder}
        required={required}
        value={values[inputName] || ""}
        onBlur={(event) => handleBlur(isError(event), event)}
        onChange={handleChange}
      />
    </>
  )
}

const { bool, func, object, string } = PropTypes

InputUsername.propTypes = {
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

export default InputUsername

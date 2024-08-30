import PropTypes from 'prop-types'

import { TextField } from '@mui/material'

const InputMultilineGeneric = (
  {
    errors,
    handleBlur,
    handleChange,
    helperText = 'Please enter valid text',
    inputName = 'multilineGeneric',
    labeltext = 'Generic Text Input',
    placeholder, 
    required = false,
    values
  }) => {

  const validate = event => {
    const { target: { name }, } = event

    return values[name] && values[name].length > 1 ? false : true  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <>
      <TextField
        error={errors[inputName] }
        helperText={errors[inputName] ? helperText : null }
        name={inputName}
        label={labeltext}
        multiline={true}
        placeholder={placeholder}
        required={required}
        value={values[inputName] || ""}
        onBlur={(event) => handleBlur(validate(event), event)}
        onChange={handleChange}
      />
    </>
  )
}

const { bool, func, object, string } = PropTypes

InputMultilineGeneric.propTypes = {
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

export default InputMultilineGeneric

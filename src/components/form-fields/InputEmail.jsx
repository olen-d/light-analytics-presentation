import PropTypes from 'prop-types'

import { TextField } from '@mui/material'

const InputEmail = (
  {
    errors,
    handleBlur,
    handleChange,
    helperText = 'Please enter a valid email address',
    inputName = 'email',
    labeltext = 'Email',
    placeholder, 
    required = false,
    values
  }) => {

    const validate = async event => {
      const { target: { name }, } = event
  
      const expression = /.+@.+\..+/i
      if(expression.test(String(values[name]).toLowerCase())) {
        try {
          const result = await fetch(
            `${import.meta.env.VITE_ANALYTICS_API_BASE_URL}/api/v1/mail/check-mx/${values[name]}`, {
              method: 'GET',
              headers: {
                'api-key': import.meta.env.VITE_ANALYTICS_API_KEY_READ
              }
            }
          )
          const data = await result.json()
          const { mxExists } = data
    
          return mxExists ? false : true
        } catch {
          return false
        }
      } else {
        return true
      }
    }

  return(
    <>
      <TextField
        error={errors[inputName] }
        helperText={errors[inputName] ? helperText : null }
        name={inputName}
        label={labeltext}
        placeholder={placeholder}
        required={required}
        value={values[inputName] || ""}
        onBlur={(event) => handleBlur(validate(event), event)}
        onChange={handleChange}
        type="email"
      />
    </>
  )
}

const { bool, func, object, string } = PropTypes

InputEmail.propTypes = {
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

export default InputEmail

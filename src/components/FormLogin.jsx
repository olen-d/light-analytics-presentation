'use strict'
import { useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import InputUsername from './form-fields/InputUsername.jsx'
import InputPassword from './form-fields/InputPassword.jsx'

import { useAuth } from '../hooks/useAuth.jsx'
import useForm from '../hooks/useForm'

import Grid from '@mui/material/Unstable_Grid2'
import { Box, Button, Stack } from '@mui/material'

const FormLogin = ({ submitBtnContent = "Submit" }) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    initializeFields,
    values
  } = useForm()

  const { login } = useAuth()
  
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (Object.values(errors).indexOf(true) > -1) {
      setIsError(true)
    } else {
      setIsError(false)
    }
  }, [errors])

  const apiKey = import.meta.env.VITE_ANALYTICS_API_KEY
  const baseAnalyticsApiUrl = import.meta.env.VITE_ANALYTICS_API_BASE_URL

  const handleSubmit = async () => {
    if (isError) {
      // Fail
    } else {
      const url = `${baseAnalyticsApiUrl}/api/v1/auth/token/grant-type/password`
      const requestOptions = {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }
      
      const response = await fetch(url, requestOptions)
      const result = await response.json()

      if (result.status === 'ok') {
        const { data: { tokenType, accessToken, refreshToken } } = result
        if (tokenType === 'bearer') {
          login(accessToken, refreshToken)
        }
      } else {
        // Return Error
      }


    }
  }

  // const actuallySubmit = () => {

  // }

  return(
    <>
      <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Box sx={{ p: 2}} className="form-background">
          <Stack spacing={4}>
            <InputUsername
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              helperText="Please enter a valid username. A username can contain any combination of lowercase letters and numbers. Special charcters . - and _ can be used as separators"
              required={true}
              values={values}
            />
            <InputPassword
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              helperText="Please enter a valid password. Passwords must be at least eight characters long, with one uppercase and one lowecase letter and at least one number or special character"
              inputName="plaintextPassword"
              required={true}
              values={values}
            />
            <Button
              disabled={isError}
              variant="contained"
              onClick={handleSubmit} 
            >
              {submitBtnContent}
            </Button>
          </Stack>
        </Box>
      </Grid>
    </>
  )
}

const { string } = PropTypes

FormLogin.propTypes = {
  submitBtnContent: string,
}

export default FormLogin

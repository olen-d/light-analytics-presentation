'use strict'

import FormLogin from "../components/FormLogin"
const LoginView = () => {
  return(
    <>
      <h1 className="site-lead extended">Log In</h1>
      <p>
        View your site analytics and manage API keys.
      </p>
      <div className="form-login-container">
        <FormLogin submitBtnContent="Log In"/>
      </div>
    </>
  )
}

export default LoginView

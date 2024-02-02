import FormSignup from "../components/FormSignup"

const SignupView = () => {
  return(
    <>
      <h1 className="site-lead extended">Let&lsquo;s get started.</h1>
      <p>
        Create an account to begin tracking visitors to your website and reviewing analytics.
      </p>
      <div>
        <FormSignup submitBtnContent="Sign Up"/>
      </div>
    </>
  )
}

export default SignupView

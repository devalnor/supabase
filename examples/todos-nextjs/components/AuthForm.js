import { useState } from 'react'
import StyledInput from 'components/StyledInput'
import StyledButton from 'components/StyledButton'

const AuthForm = ({ signUp, logIn }) => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const handleSignUp = (e) => {
    e.preventDefault()
    console.log('handleSignUp')
    signUp(email, password)
  }

  return (
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <StyledInput
          name="email"
          title="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <StyledInput
          name="password"
          title="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
        />

        <StyledButton onClick={handleSignUp}>Sign Up</StyledButton>
      </form>
    </div>
  )
}

export default AuthForm

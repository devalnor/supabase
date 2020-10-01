import AuthManager from 'components/AuthManager'
import AuthForm from 'components/AuthForm'

export default function Home() {
  return (
    <AuthManager AuthForm={AuthForm}>
      <div>Hello World</div>
    </AuthManager>
  )
}

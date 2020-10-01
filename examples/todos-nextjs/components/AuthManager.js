import React, { useState, useEffect, useRef, useContext } from 'react'
import AuthStore from 'lib/AuthStore'

const defaultUser = {
  id: null,
  email: '',
}

const defaultAuthContext = {
  user: defaultUser,
  isLogged: () => false,
  signUp: () => {},
  logIn: () => {},
  logOut: () => {},
}

// Initate the context
const AuthContext = React.createContext(defaultAuthContext)

// Skip SSR Loader Component
const NoSSR = ({ isLoading, children }) => {
  return <>{isLoading ? 'Loading...' : children}</>
}

// Locker Component
const AuthLocker = ({ AuthForm, children }) => {
  const { isLogged, logIn, signUp } = useContext(AuthContext)
  return <>{isLogged() ? children : <AuthForm logIn={logIn} signUp={signUp} />}</>
}

const AuthManager = ({ AuthForm, children }) => {
  const [user, setUser] = useState(defaultUser)
  const [isLoading, setLoading] = useState(true) // No SSR flag

  useEffect(() => {
    const asyncLoader = async () => {
      const authUser = await AuthStore.getUser()
      if (authUser) {
        setUser(authUser)
      }
    }
    asyncLoader()
  }, [])

  const signUp = async (email, password) => {
    console.log('signUp')
    setUser(await AuthStore.signUp(email, password))
    console.log(user)
  }

  const logIn = () => {
    return false
  }

  const logOut = () => {
    return false
  }

  const isLogged = () => {
    console.log('isLogged', user)
    return user.id
  }

  return (
    <AuthContext.Provider value={{ user, isLogged, logIn, logOut, signUp }}>
      <AuthLocker AuthForm={AuthForm}>{children}</AuthLocker>
    </AuthContext.Provider>
  )
}

export default AuthManager

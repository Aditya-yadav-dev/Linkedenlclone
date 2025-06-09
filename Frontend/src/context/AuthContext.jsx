import React, { createContext } from 'react'
export const AuthDataContext  = createContext()
const ServerUrl = 'https://linkdlclone.onrender.com';
let value ={ 
    ServerUrl
}
const AuthContext = ({children}) => {
  return (
    <>
    <AuthDataContext.Provider value={value}>
    {children}
    </AuthDataContext.Provider>
    </>
  )
}

export default AuthContext
import React from 'react'
import { useEffect } from 'react'
export default function Login() {
    useEffect(() => {
        localStorage.setItem("token", "123456")
    }, [])
    return (
        <div>Login</div>
    )
}

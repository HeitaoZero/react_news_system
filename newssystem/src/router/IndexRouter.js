import React from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import Login from '../views/login/Login'
export default function IndexRouter() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                {/* <Route path="/" element={<NewsSandBox />} /> */}
                <Route path="/*" element={
                    localStorage.getItem("token") ? (
                        <NewsSandBox />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } />
            </Routes>
        </HashRouter>
    )
}

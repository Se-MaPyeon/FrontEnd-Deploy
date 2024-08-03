import React, { createContext, useState } from 'react';
import { login } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = async (id, pw) => {
        try {
            const response = await login(id, pw);
            if (response.accessToken) {
                setIsLogin(true);
                setUser({
                    id,
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken
                });
            } else {
                alert(response.message);
            }
        } catch (error) {
            alert('로그인 정보를 다시 확인해주세요.');
        }
    };

    const handleLogout = () => {
        setIsLogin(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLogin, user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
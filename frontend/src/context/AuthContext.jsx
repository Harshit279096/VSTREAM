import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Optional: fetch user profile if token exists
            const savedUser = localStorage.getItem('user');
            if (savedUser) setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        const { user, token } = res.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    };

    const register = async (userData) => {
        const res = await axios.post(`${API_URL}/api/auth/register`, userData);
        const { user, token } = res.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

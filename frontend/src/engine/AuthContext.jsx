// ==========================================
// GigShield AI — Auth Context (Login State)
// ==========================================

import { createContext, useContext, useReducer, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Demo credentials
const DEMO_USERS = {
    'raj@gigguard.ai': {
        password: 'demo123',
        name: 'Raj Kumar',
        role: 'worker',
        avatar: null,
        city: 'Delhi',
    },
    'admin@gigguard.ai': {
        password: 'demo123',
        name: 'Vikram Mehta',
        role: 'admin',
        avatar: null,
        city: 'Mumbai',
    },
};

const initialState = {
    isAuthenticated: false,
    user: null,
    error: null,
    isLoading: false,
};

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, isLoading: true, error: null };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                isLoading: false,
                error: null,
            };
        case 'LOGIN_ERROR':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return { ...initialState };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = useCallback(async (email, password) => {
        dispatch({ type: 'LOGIN_START' });

        // Simulate network delay for realism
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = DEMO_USERS[email.toLowerCase()];

                if (!user) {
                    dispatch({ type: 'LOGIN_ERROR', payload: 'No account found with this email' });
                    resolve(false);
                    return;
                }

                if (user.password !== password) {
                    dispatch({ type: 'LOGIN_ERROR', payload: 'Incorrect password' });
                    resolve(false);
                    return;
                }

                const userData = {
                    email: email.toLowerCase(),
                    name: user.name,
                    role: user.role,
                    avatar: user.avatar,
                    city: user.city,
                };

                dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
                resolve(userData);
            }, 1200);
        });
    }, []);

    const logout = useCallback(() => {
        dispatch({ type: 'LOGOUT' });
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

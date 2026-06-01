/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import Cookies from 'js-cookie';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        try {
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(Cookies.get('auth_token') || null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('auth_token'));

    const logout = useCallback(async () => {
        try {
            await axiosClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            Cookies.remove('auth_token', { path: '/' });
            localStorage.removeItem('user');
        }
    }, []);

    const fetchUserProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/auth/profile');
            if (response.data.success) {
                setUser(response.data.data.user);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            const localUser = localStorage.getItem('user');
            if (localUser) {
                try {
                    setUser(JSON.parse(localUser));
                    setIsAuthenticated(true);
                    return;
                } catch (e) {
                    console.error('Local user restore failed:', e);
                }
            }
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    // Load user profile on mount if token exists
    useEffect(() => {
        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchUserProfile();
        }
    }, [token, fetchUserProfile]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axiosClient.post('/auth/login', {
                email,
                password,
            });

            if (response.data.success) {
                const { user: userObj, token: tokenStr } = response.data.data;
                setToken(tokenStr);
                setUser(userObj);
                setIsAuthenticated(true);

                // Save token and user to cookies/localStorage
                Cookies.set('auth_token', tokenStr, { expires: 7, path: '/' });
                localStorage.setItem('user', JSON.stringify(userObj));

                return { success: true, user: userObj };
            }
            return { success: false, error: response.data.message || 'Login failed' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Login failed. Please check your credentials.',
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await axiosClient.post('/auth/register', userData);
            if (response.data.success) {
                return { success: true, user: response.data.data.user };
            }
            return { success: false, error: response.data.message || 'Registration failed' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed',
            };
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (userData) => {
        setLoading(true);
        try {
            const response = await axiosClient.put('/auth/profile', userData);
            if (response.data.success) {
                const updatedUser = response.data.data.user;
                const newUserData = { ...user, ...updatedUser };
                setUser(newUserData);
                localStorage.setItem('user', JSON.stringify(newUserData));
                return { success: true };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Update failed' };
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
        setLoading(true);
        try {
            const response = await axiosClient.post('/auth/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirmation,
            });
            if (response.data.success) {
                return { success: true };
            }
            return { success: false, error: response.data.message };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Change password failed' };
        } finally {
            setLoading(false);
        }
    };

    const getRoleName = () => {
        if (!user?.role) return null;
        const roleName = typeof user.role === 'string' ? user.role : user.role.name;
        return roleName ? roleName.toString().trim() : null;
    };

    const hasRole = (roleName) => {
        const currentRole = getRoleName();
        if (!currentRole) return false;
        return currentRole.toLowerCase() === roleName.toLowerCase();
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        hasRole,
        isSuperAdmin: () => hasRole('Super Admin'),
        isManager: () => hasRole('Manager'),
        isConsultant: () => hasRole('Consultant'),
        isCustomer: () => hasRole('Customer'),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

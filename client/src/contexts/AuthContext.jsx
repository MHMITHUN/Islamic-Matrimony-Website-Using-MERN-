import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { authAPI } from '../api/api';
import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [role, setRole] = useState('user');
    const [isGuardian, setIsGuardian] = useState(false);
    const [isImam, setIsImam] = useState(false);
    const [trustTier, setTrustTier] = useState('none');
    const queryClient = useQueryClient();

    const googleProvider = new GoogleAuthProvider();

    // Register with email/password
    const register = async (email, password, name, photoURL) => {
        setLoading(true);
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile with name and photo
        await updateProfile(result.user, {
            displayName: name,
            photoURL: photoURL || ''
        });

        return result;
    };

    // Login with email/password
    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Login with Google
    const loginWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // Logout
    const logout = async () => {
        setLoading(true);
        localStorage.removeItem('access-token');
        localStorage.removeItem('nikah-recently-viewed');
        window.dispatchEvent(new CustomEvent('clear-recently-viewed'));
        setIsAdmin(false);
        setIsPremium(false);
        setRole('user');
        setIsGuardian(false);
        setIsImam(false);
        setTrustTier('none');
        setUser(null);
        queryClient.clear();
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update profile
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });
    };

    // Get JWT Token
    const getJWTToken = async (userData) => {
        try {
            const { data } = await authAPI.getToken(userData);
            if (data.token) {
                localStorage.setItem('access-token', data.token);
            }
            return data.token;
        } catch (error) {
            console.error('Error getting JWT:', error);
            return null;
        }
    };

    // Admin login (env-based, no Firebase required)
    const adminLogin = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await authAPI.adminLogin({ email, password });
            if (data.token) {
                localStorage.setItem('access-token', data.token);
            }
            // Set admin user state directly from server response
            setUser({
                email: data.user.email,
                displayName: data.user.name,
                photoURL: data.user.photoURL,
                uid: data.user._id
            });
            setIsAdmin(true);
            setIsPremium(true);
            return data;
        } catch (error) {
            console.error('Admin login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Check user status (single /auth/me call — derives role, guardian/imam, premium, trust)
    const checkUserStatus = async (email) => {
        try {
            const { data } = await authAPI.getCurrentUser();
            const r = data.role || 'user';
            setRole(r);
            setIsAdmin(r === 'admin');
            setIsPremium(data.isPremium || r === 'admin');
            setIsGuardian(r === 'guardian');
            setIsImam(r === 'imam');
            setTrustTier(data.tazkiyaTier || 'none');
        } catch (error) {
            console.error('Error checking user status:', error);
            setRole('user');
            setIsAdmin(false);
            setIsPremium(false);
            setIsGuardian(false);
            setIsImam(false);
        }
    };

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Get JWT token
                try {
                    await getJWTToken({
                        email: currentUser.email,
                        name: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    });

                    // Check user status
                    await checkUserStatus(currentUser.email);
                } catch (error) {
                    console.error('Error in auth state change:', error);
                }
            } else {
                // If Firebase user is null, check if there is a valid JWT session token in localStorage (e.g. for dedicated Admin login)
                const token = localStorage.getItem('access-token');
                let restored = false;
                if (token) {
                    try {
                        const { data } = await authAPI.getCurrentUser();
                        if (data && data.email) {
                            setUser({
                                email: data.email,
                                displayName: data.name,
                                photoURL: data.photoURL,
                                uid: data._id,
                                role: data.role
                            });
                            const r = data.role || 'user';
                            setRole(r);
                            setIsAdmin(r === 'admin');
                            setIsPremium(data.isPremium || r === 'admin');
                            setIsGuardian(r === 'guardian');
                            setIsImam(r === 'imam');
                            setTrustTier(data.tazkiyaTier || 'none');
                            restored = true;
                        }
                    } catch (err) {
                        console.warn('Failed to restore session from stored token:', err);
                    }
                }

                if (!restored) {
                    setUser(null);
                    setIsAdmin(false);
                    setIsPremium(false);
                    setRole('user');
                    setIsGuardian(false);
                    setIsImam(false);
                    setTrustTier('none');
                    localStorage.removeItem('access-token');
                    localStorage.removeItem('nikah-recently-viewed');
                    window.dispatchEvent(new CustomEvent('clear-recently-viewed'));
                    queryClient.clear();
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [queryClient]);

    useEffect(() => {
        const handleUnauthorized = () => {
            console.warn('Session expired (401 Unauthorized), logging out...');
            logout();
        };
        window.addEventListener('unauthorized', handleUnauthorized);
        return () => window.removeEventListener('unauthorized', handleUnauthorized);
    }, []);

    const value = {
        user,
        loading,
        isAdmin,
        isPremium,
        role,
        isGuardian,
        isImam,
        trustTier,
        register,
        login,
        loginWithGoogle,
        adminLogin,
        logout,
        getJWTToken,
        checkUserStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

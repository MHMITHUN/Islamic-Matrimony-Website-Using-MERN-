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
        setIsAdmin(false);
        setIsPremium(false);
        return signOut(auth);
    };

    // Get JWT token and save to localStorage
    const getJWTToken = async (userData) => {
        try {
            const response = await authAPI.getToken(userData);
            const { token, user: dbUser } = response.data;
            localStorage.setItem('access-token', token);
            setIsAdmin(dbUser.role === 'admin');
            setIsPremium(dbUser.isPremium || false);
            return token;
        } catch (error) {
            console.error('Error getting JWT token:', error);
            throw error;
        }
    };

    // Check user status from database
    const checkUserStatus = async (email) => {
        try {
            const [adminRes, premiumRes] = await Promise.all([
                authAPI.checkAdmin(email),
                authAPI.checkPremium(email)
            ]);
            setIsAdmin(adminRes.data.isAdmin);
            setIsPremium(premiumRes.data.isPremium);
        } catch (error) {
            console.error('Error checking user status:', error);
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
                setUser(null);
                setIsAdmin(false);
                setIsPremium(false);
                localStorage.removeItem('access-token');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        isAdmin,
        isPremium,
        register,
        login,
        loginWithGoogle,
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

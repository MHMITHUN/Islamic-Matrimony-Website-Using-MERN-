import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate config
const missingKeys = Object.entries(firebaseConfig)
    .filter(([key, value]) => !value && key !== 'measurementId') // measurementId is optional
    .map(([key]) => key);

if (missingKeys.length > 0) {
    const errorMessage = `
        <div style="padding: 40px; font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h1 style="color: #dc2626; margin-bottom: 16px; font-size: 24px;">Configuration Error</h1>
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px; line-height: 1.5;">
                The application cannot start because some Firebase configuration variables are missing.
            </p>
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="font-weight: 600; color: #991b1b; margin-bottom: 8px;">Missing Variables:</p>
                <ul style="list-style: disc; padding-left: 20px; color: #b91c1c; margin: 0;">
                    ${missingKeys.map(key => `<li style="margin-bottom: 4px;">${key}</li>`).join('')}
                </ul>
            </div>
            <p style="font-size: 14px; color: #6b7280;">
                Please check your <code>.env</code> file in the client directory.
            </p>
        </div>
    `;

    // Wait for DOM to be ready just in case, though this runs early
    if (document.body) {
        document.body.innerHTML = errorMessage;
        document.body.style.backgroundColor = '#f3f4f6';
    } else {
        window.onload = () => {
            document.body.innerHTML = errorMessage;
            document.body.style.backgroundColor = '#f3f4f6';
        };
    }

    throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

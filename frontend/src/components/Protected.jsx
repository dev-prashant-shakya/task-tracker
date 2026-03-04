import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Protected({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = result

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch(`${API_URL}/verify-token`, {
                    method: 'GET',
                    credentials: 'include', // sends cookies
                });
                const data = await response.json();
                
                if (data.success) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('userEmail'); // cleanup invalid session
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                localStorage.removeItem('userEmail');
                setIsAuthenticated(false);
            }
        };
        
        verifyAuth();
    }, []);

    // Show loading while verifying
    if (isAuthenticated === null) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = (WrappedComponent: React.ComponentType) => {
    const Wrapped = (props: any) => {
        const navigate = useNavigate();
        const token = sessionStorage.getItem('jwtToken');

        useEffect(() => {
            console.log(token);
            if (!token) {
                navigate('/login');
            }
        }, [token, navigate]);

        if (!token) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
    return Wrapped;
};

export default AuthWrapper;
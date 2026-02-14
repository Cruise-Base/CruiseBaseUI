import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';

export const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        const verifyEmail = async () => {
            const userId = searchParams.get('userId');
            const token = searchParams.get('token');

            if (!userId || !token) {
                setStatus('error');
                toast.error('Invalid verification link');
                return;
            }

            try {
                await api.get('/api/authentication/verify-email/confirm', {
                    params: { userId, token }
                });
                setStatus('success');
                toast.success('Email verified successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error: any) {
                setStatus('error');
                console.error(error);
                const errorMessage = error.response?.data?.message ||
                    (Array.isArray(error.response?.data) ? error.response?.data.join(', ') : error.response?.data) ||
                    'Email verification failed. The link may be invalid or expired.';
                toast.error(errorMessage);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="p-8 bg-gray-800 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-4">Email Verification</h2>

                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
                        <p>Verifying your email...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-green-500">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-lg">Email verified successfully!</p>
                        <p className="text-sm text-gray-400 mt-2">Redirecting to login...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-red-500">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="text-lg">Verification failed</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded transition-colors text-white"
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

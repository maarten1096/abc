
'use client';

export default function AuthCodeError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Authentication Error</h2>
                <p className="text-center text-gray-600 dark:text-gray-300">
                    There was an error during the authentication process. Please try again.
                </p>
            </div>
        </div>
    );
}

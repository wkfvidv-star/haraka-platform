import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface DeploymentGateProps {
    children: React.ReactNode;
}

export function DeploymentGate({ children }: DeploymentGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedAuth = localStorage.getItem('deployment_auth');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded password for demo purposes
        if (password === 'haraka2025') {
            localStorage.setItem('deployment_auth', 'true');
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('كلمة المرور غير صحيحة');
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4" dir="rtl">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>محمية بكلمة مرور</CardTitle>
                    <CardDescription>
                        هذه النسخة التجريبية محمية. الرجاء إدخال كلمة المرور للمتابعة.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="كلمة المرور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-center"
                            />
                            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            دخول
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                    <Card className="max-w-md w-full border-red-200 bg-red-50 dark:bg-red-900/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                <AlertTriangle className="h-6 w-6" />
                                حدث خطأ غير متوقع
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                نعتذر، حدثت مشكلة أثناء عرض هذه الصفحة. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.
                            </p>
                            {this.state.error && (
                                <div className="p-3 bg-white dark:bg-gray-800 rounded border text-xs font-mono overflow-auto max-h-32 text-red-600">
                                    {this.state.error.message}
                                </div>
                            )}
                            <Button
                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                إعادة تحميل الصفحة
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

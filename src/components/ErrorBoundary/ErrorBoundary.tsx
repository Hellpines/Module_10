import React, { ErrorInfo } from 'react';
import Error from '../../pages/Error/Error';
import { ErrorBoundaryProps } from '../../types/error/ErrorBoundaryProps';
import { ErrorBoundaryState } from '../../types/error/ErrorBoundaryState';

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error);
        console.error(errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <Error />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

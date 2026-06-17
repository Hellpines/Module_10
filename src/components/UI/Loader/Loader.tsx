'use client';

import CircularProgress from '@mui/material/CircularProgress';
import styled, { keyframes } from 'styled-components';
import { LoaderProps } from '../../../types/ui/LoaderProps';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

const LoaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    width: 100%;
    gap: 16px;
    margin-top: 200px;
    animation: ${fadeIn} 0.3s ease-out forwards;
`;

const LoaderText = styled.p``;

export function Loader({ label = 'Loading...' }: LoaderProps) {
    return (
        <LoaderWrapper>
            <CircularProgress size={80} thickness={4.5} sx={{ color: `var(--accent)` }} />
            {label && <LoaderText>{label}</LoaderText>}
        </LoaderWrapper>
    );
}

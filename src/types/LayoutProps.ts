import { PageStatusType } from './PageStatusType';
import { ReactNode } from 'react';

export interface LayoutProps {
    pageStatus: PageStatusType;
    children: ReactNode;
}
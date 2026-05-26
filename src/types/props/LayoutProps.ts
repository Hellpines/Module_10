import { PageStatusType } from '../page/PageStatusType';
import { ReactNode } from 'react';

export interface LayoutProps {
    pageStatus: PageStatusType;
    children: ReactNode;
}

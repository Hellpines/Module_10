export interface PageSeoConfig {
    title: string;
    description?: string;
    path: string;
    noIndex?: boolean;
    ogType?: 'website' | 'article' | 'profile';
}

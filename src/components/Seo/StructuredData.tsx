import { StructuredDataProps } from '@/types/props/StructuredDataProps';

export function StructuredData({ data }: StructuredDataProps) {
    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

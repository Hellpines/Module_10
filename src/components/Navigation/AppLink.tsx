'use client';

import { AppLinkProps } from '@/types/props/AppLinkProps';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';

export function AppLink({ href, prefetch = true, onMouseEnter, ...props }: AppLinkProps) {
    const router = useRouter();

    const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
        if (typeof href === 'string') {
            router.prefetch(href);
        }

        onMouseEnter?.(event);
    };

    return <Link href={href} prefetch={prefetch} onMouseEnter={handleMouseEnter} {...props} />;
}

'use client';

import { createAppPageView } from '@/lib/navigation/create-lazy-view';

export const LazyNotesPageView = createAppPageView(
    () => import('@/views/Notes/Notes'),
    'Notes',
    'protected'
);

export const LazyProfilePageView = createAppPageView(
    () => import('@/views/Profile/Profile'),
    'Profile',
    'protected'
);

export const LazyArchivedPageView = createAppPageView(
    () => import('@/views/Archived/Archived'),
    'Archived',
    'protected'
);

export const LazyTrashPageView = createAppPageView(
    () => import('@/views/Trash/Trash'),
    'Trash',
    'protected'
);

export const LazySignInPageView = createAppPageView(
    () => import('@/views/Sign/SignIn'),
    'SignIn',
    'public',
    { eager: true }
);

export const LazySignUpPageView = createAppPageView(
    () => import('@/views/Sign/SignUp'),
    'SignUp',
    'public',
    { eager: true }
);

export const LazyNoAuthPageView = createAppPageView(
    () => import('@/views/NoAuth/NoAuth'),
    'NoAuth',
    'public',
    { eager: true }
);

export const LazyNotFoundPageView = createAppPageView(
    () => import('@/views/NotFound/NotFound'),
    'NotFound',
    'none'
);

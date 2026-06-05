import type { User } from '../../src/types/auth/User';

export const MOCK_TOKEN = 'fake-jwt-token-e2e';

export const MOCK_USER: User = {
    id: 1,
    username: 'helenahills',
    firstName: 'Helena',
    secondName: 'Hills',
    email: 'helena.hills@social.com',
    description:
        'Team lead overseeing product development and architecture across multiple platforms.',
    lastLogin: '2026-06-03',
    creationDate: '2026-06-01',
    modifiedDate: '2026-06-02',
};

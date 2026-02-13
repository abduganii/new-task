import { faker } from '@faker-js/faker';
import type { User } from '../types';

export const generateUsers = (count: number): User[] => {
    return Array.from({ length: count }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 90 }),
        role: faker.helpers.arrayElement(['Admin', 'User', 'Manager']),
        status: faker.helpers.arrayElement(['Active', 'Inactive', 'Pending']),
        lastLogin: faker.date.recent(),
        bio: faker.lorem.sentences(3), // Heavy rendering text
        avatar: faker.image.avatar(),
    }));
};

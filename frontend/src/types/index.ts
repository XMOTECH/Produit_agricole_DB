export type UserRole = 'ADMIN' | 'SELLER' | 'BUYER';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
    createdAt?: string;
}

export interface Farm {
    id: string;
    name: string;
    location?: string;
    size?: number;
    ownerId?: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    category?: string;
    price?: number;
}

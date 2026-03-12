export declare enum UserRole {
    ADMIN = "ADMIN",
    SELLER = "SELLER",
    BUYER = "BUYER"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}

import { User } from '../../users/entities/user.entity';
export declare class Farm {
    id: string;
    name: string;
    location: string;
    owner: User;
    ownerId: string;
    createdAt: Date;
}

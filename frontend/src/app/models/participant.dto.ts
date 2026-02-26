import { CategoryEnum } from '../utils/enums/category.enum';

export interface ParticipantCreate {
    title: string;
    city: string;
    types: CategoryEnum[];
    pinCode?: string;
    date?: string; // Stored as ISO string
    startTime?: string;
    endTime?: string;
    status?: string;
}

export interface ParticipantResponse extends ParticipantCreate {
    id: string;
    created_at: string;
}

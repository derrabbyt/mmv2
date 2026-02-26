import { CategoryEnum } from '../utils/enums/category.enum';

export interface MeetupCreate {
    title: string;
    city: string;
    types: CategoryEnum[];
    pinCode?: string;
    date?: string; // Stored as ISO string
    startTime?: string;
    endTime?: string;
    status?: string;
}

export interface MeetupResponse extends MeetupCreate {
    id: string;
    created_at: string;
    expires_at?: string;
}

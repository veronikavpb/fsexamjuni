import { Experience as ExperiencePrisma, User as UserPrisma } from '@prisma/client';
import { User } from './user';

export interface ExperienceInput {
    name: string;
    description: string;
    date: Date;
    location: string;
    organiserId: number;
}

export class Experience {
    private id?: number;
    private readonly name: string;
    private readonly description: string;
    private readonly date: Date;
    private readonly location: string;
    private readonly organiserId: number;
    private readonly attendees: User[];

    constructor(input: {
        id?: number;
        name: string;
        description: string;
        date: Date;
        location: string;
        organiserId: number;
        attendees?: User[];
    }) {
        this.validate(input);
        this.id = input.id;
        this.name = input.name.trim();
        this.description = input.description.trim();
        this.date = input.date;
        this.location = input.location.trim();
        this.organiserId = input.organiserId;
        this.attendees = input.attendees ?? [];
    }

    private validate({ name, description, date, location, organiserId }: any) {
        if (!name || !name.trim()) throw new Error('Name is required');
        if (!description || !description.trim()) throw new Error('Description is required');
        if (!location || !location.trim()) throw new Error('Location is required');
        if (!(date instanceof Date) || isNaN(date.getTime()))
            throw new Error('Valid date is required');
        if (!organiserId) throw new Error('Organiser ID is required');
    }

    getId(): number | undefined {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getDescription(): string {
        return this.description;
    }
    getDate(): Date {
        return this.date;
    }
    getLocation(): string {
        return this.location;
    }
    getOrganiserId(): number {
        return this.organiserId;
    }
    getAttendees(): User[] {
        return this.attendees;
    }

    static fromPrisma(record: ExperiencePrisma & { attendees?: UserPrisma[] }) {
        const attendees = record.attendees?.map(User.fromPrisma) ?? [];
        return new Experience({
            id: record.id,
            name: record.name,
            description: record.description,
            date: record.date,
            location: record.location,
            organiserId: record.organiserId,
            attendees,
        });
    }
}

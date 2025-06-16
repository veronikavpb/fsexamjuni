import { Event } from '../model/event';
import database from './database';
import { Event as EventPrisma } from '@prisma/client';

const getAllEvents = async (): Promise<Event[]> => {
    const records = await database.event.findMany({
        include: { organiser: true, attendees: true },
        orderBy: { date: 'asc' },
    });
    return records.map((r) => Event.from(r));
};

const getEventById = async ({ id }: { id: number }): Promise<Event> => {
    const record = await database.event.findUnique({
        where: { id },
        include: { organiser: true, attendees: true },
    });
    if (!record) throw new Error(`Event with id: ${id} does not exist.`);
    return Event.from(record);
};

const getEventsByOrganiserId = async ({
    organiserId,
}: {
    organiserId: number;
}): Promise<Event[]> => {
    try {
        const eventsPrisma = await database.event.findMany({
            where: { organiserId },
            include: {
                organiser: true,
                attendees: true,
            },
        });
        return eventsPrisma.map((eventPrisma) => Event.from(eventPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createEvent = async (input: {
    name: string;
    description: string;
    date: Date;
    location: string;
    organiserId: number;
}): Promise<Event> => {
    const record = await database.event.create({
        data: {
            name: input.name,
            description: input.description,
            date: input.date,
            location: input.location,
            organiserId: input.organiserId,
        },
        include: { organiser: true, attendees: true },
    });
    return Event.from(record);
};

export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    createEvent,
};

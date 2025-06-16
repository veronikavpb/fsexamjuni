import eventDB from '../repository/event.db';
import userDB from '../repository/user.db';
import { Event } from '../model/event';
import { User } from '../model/user';

const getAllEvents = async (): Promise<Event[]> => {
    return await eventDB.getAllEvents();
};

const getEventById = async ({ id }: { id: number }): Promise<Event> => {
    return await eventDB.getEventById({ id });
};

const getEventsByOrganiserId = async ({
    organiserId,
}: {
    organiserId: number;
}): Promise<Event[]> => {
    return await eventDB.getEventsByOrganiserId({ organiserId });
};

const getUpcomingEvents = async (): Promise<Event[]> => {
    const all = await eventDB.getAllEvents();
    const now = new Date();
    return all.filter((evt) => evt.getDate() > now);
};

const createEvent = async (input: {
    name: string;
    description: string;
    date: Date;
    location: string;
    organiserId: number;
}): Promise<Event> => {
    // ──────── Validation Rule – Date Conflict ────────
    // Check if this organiser already has an event on the exact same date
    const existing = await eventDB.findEventByOrganiserAndDate(input.organiserId, input.date);
    if (existing) {
        throw new Error('You already have an experience on this date.');
    }
    // ────────────────────────────────────────────────────

    // If no conflict, proceed to create
    return await eventDB.createEvent(input);
};

export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    getUpcomingEvents,
    createEvent,
};

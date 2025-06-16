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

const getUpcomingEvents = () => {};

const createEvent = async (input: {
    name: string;
    description: string;
    date: Date;
    location: string;
    organiserId: number;
}): Promise<Event> => {
    const existing = (
        await eventDB.getEventsByOrganiserId({ organiserId: input.organiserId })
    ).find((e) => e.getDate().getTime() === input.date.getTime());
    if (existing) {
        throw new Error('You already have an event on this date.');
    }
    return await eventDB.createEvent(input);
};

export default {
    getAllEvents,
    getEventById,
    getEventsByOrganiserId,
    getUpcomingEvents,
    createEvent,
};

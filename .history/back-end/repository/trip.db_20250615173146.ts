import { Trip } from '../model/trip';
import database from './database';

export const getAllTrips = async (): Promise<Trip[]> => {
    const trips = await database.trip.findMany({
        include: {
            organiser: true,
            attendees: true,
        },
    });

    return trips.map(Trip.from);
};

export const getTripById = async ({ id }: { id: number }): Promise<Trip | null> => {
    const trip = await database.trip.findUnique({
        where: { id },
        include: {
            organiser: true,
            attendees: true,
        },
    });

    return trip ? Trip.from(trip) : null;
};

export default {
    getAllTrips,
    getTripById,
};

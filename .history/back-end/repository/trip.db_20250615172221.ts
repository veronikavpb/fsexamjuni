import { Trip } from '../model/trip';
import database from './database';

export const getAllTrips = async () => {
    return await database.trip.findMany({
        include: {
            organiser: true,
            attendees: true,
        },
    });
};

const getTripById = async () => {};

export default {
    getAllTrips,
    getTripById,
};

import tripService from '../../service/trip.service';
import { Trip } from '../../model/trip';

describe('Trip Service', () => {
    let allTrips: Trip[];

    beforeAll(async () => {
        allTrips = await tripService.getAllTrips();
    });

    it('should return a list of trips', async () => {
        expect(Array.isArray(allTrips)).toBe(true);
        expect(allTrips.length).toBeGreaterThan(0);
        expect(allTrips[0]).toBeInstanceOf(Trip);
    });

    it('should return a trip by ID', async () => {
        const firstTrip = allTrips[0];
        const fetchedTrip = await tripService.getTripById({ id: firstTrip.getId()! });
        expect(fetchedTrip.getId()).toBe(firstTrip.getId());
        expect(fetchedTrip.getDestination()).toBe(firstTrip.getDestination());
    });

    it('should throw an error for non-existing trip ID', async () => {
        await expect(tripService.getTripById({ id: 999999 })).rejects.toThrow(
            'Trip with id: 999999 does not exist.'
        );
    });

    it('should return only upcoming trips', async () => {
        const upcomingTrips = await tripService.getUpcomingTrips();
        const now = new Date();
        const allInFuture = upcomingTrips.every((trip) => trip.getStartDate() > now);
        expect(allInFuture).toBe(true);
    });
});

import tripService from '../../service/trip.service';

describe('Trip Service', () => {
    it('should return a list of trips', async () => {
        const trips = await tripService.getAllTrips();
        expect(Array.isArray(trips)).toBe(true);
        expect(trips.length).toBeGreaterThan(0);
    });

    it('should return a trip by ID', async () => {
        const allTrips = await tripService.getAllTrips();
        const trip = await tripService.getTripById({ id: allTrips[0].getId() });
        expect(trip.getDestination()).toBeDefined();
    });

    it('should throw error if trip not found', async () => {
        await expect(tripService.getTripById({ id: 999999 })).rejects.toThrow(
            'Trip with id: 999999 does not exist.'
        );
    });

    it('should return only upcoming trips', async () => {
        const upcoming = await tripService.getUpcomingTrips();
        expect(upcoming.every((trip) => trip.getStartDate() > new Date())).toBe(true);
    });
});

import tripService from '../service/trip.service';

describe('Trip Service', () => {
  it('should return a list of trips', async () => {
    const trips = await tripService.getAllTrips();
    expect(Array.isArray(trips)).toBe(true);
    expect(trips.length).toBeGreaterThan(0);
  });

  

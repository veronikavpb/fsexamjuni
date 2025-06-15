import { Trip } from '../../model/trip';
import { User } from '../../model/user';

describe('Trip domain model', () => {
    const organiser = new User({
        id: 1,
        firstName: 'Alice',
        lastName: 'Organiser',
        email: 'alice@example.com',
        password: 'securepass',
        isOrganiser: true,
    });

    const attendee = new User({
        id: 2,
        firstName: 'Bob',
        lastName: 'Attendee',
        email: 'bob@example.com',
        password: '123456',
        isOrganiser: false,
    });

    const baseTripData = {
        createdAt: new Date(),
        updatedAt: new Date(),
        destination: 'Barcelona',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-07'),
        description: 'A trip to Spain!',
        organiser,
        attendees: [],
    };

    it('should create a valid trip', () => {
        const trip = new Trip(baseTripData);
        expect(trip.getDestination()).toBe('Barcelona');
        expect(trip.getOrganiser().getFirstName()).toBe('Alice');
        expect(trip.getAttendees().length).toBe(0);
    });

    it('should add and remove attendees', () => {
        const trip = new Trip(baseTripData);
        trip.addAttendee(attendee);
        expect(trip.getAttendees().length).toBe(1);
        expect(trip.isUserAttending(attendee.getId()!)).toBe(true);

        trip.removeAttendee(attendee.getId()!);
        expect(trip.getAttendees().length).toBe(0);
    });

    it('should throw if startDate >= endDate', () => {
        expect(() => {
            new Trip({
                ...baseTripData,
                startDate: new Date('2025-07-10'),
                endDate: new Date('2025-07-01'),
            });
        }).toThrow('End date must be after start date');
    });

    it('should throw if organiser is not marked as organiser', () => {
        const fakeOrganiser = new User({
            id: 3,
            firstName: 'Charlie',
            lastName: 'Client',
            email: 'charlie@example.com',
            password: '123456',
            isOrganiser: false,
        });

        expect(() => {
            new Trip({
                ...baseTripData,
                organiser: fakeOrganiser,
            });
        }).toThrow('User must be an organiser to organise trips');
    });
});

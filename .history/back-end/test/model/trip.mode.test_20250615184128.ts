import { Trip } from '../../model/trip';
import { User } from '../../model/user';

describe('Trip domain model', () => {
    it('should correctly calculate duration in days', () => {
        const organiser = new User(1, 'Jane', 'Doe', 'jane@example.com', 'pass', true);
        const attendees = [];

        const trip = new Trip(
            1,
            'Rome',
            'City tour',
            new Date('2025-07-01'),
            new Date('2025-07-05'),
            organiser,
            attendees
        );

        const duration = Math.ceil(
            (trip.getEndDate().getTime() - trip.getStartDate().getTime()) / (1000 * 60 * 60 * 24)
        );

        expect(duration).toBe(4);
    });
});

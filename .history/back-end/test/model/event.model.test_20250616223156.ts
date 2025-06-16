import { Event } from '../../model/event';
import { User } from '../../model/user';
import eventService from '../../service/event.service';
import eventDB from '../../repository/event.db';
jest.mock('../repository/event.db');

describe('Event Model', () => {
    const mockOrganiser = new User({
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        password: 'password123',
        isOrganiser: true,
    });

    it('should create a valid Event', () => {
        const futureDate = new Date(Date.now() + 1000 * 60 * 60);
        const evt = new Event({
            name: 'Test Event',
            description: 'A valid description',
            date: futureDate,
            location: 'Test Location',
            organiser: mockOrganiser,
            createdAt: new Date(),
            updatedAt: new Date(),
            attendees: [],
        });
        expect(evt.getName()).toBe('Test Event');
        expect(evt.getDate().getTime()).toBe(futureDate.getTime());
        expect(evt.getOrganiser().getEmail()).toBe('alice@example.com');
    });

    it('should throw if name is empty', () => {
        expect(() => {
            new Event({
                name: '   ',
                description: 'desc',
                date: new Date(Date.now() + 1000),
                location: 'loc',
                organiser: mockOrganiser,
                createdAt: new Date(),
                updatedAt: new Date(),
                attendees: [],
            });
        }).toThrow('Event name is required');
    });

    it('should throw if date is not in the future', () => {
        expect(() => {
            new Event({
                name: 'Name',
                description: 'Desc',
                date: new Date(Date.now() - 1000),
                location: 'Loc',
                organiser: mockOrganiser,
                createdAt: new Date(),
                updatedAt: new Date(),
                attendees: [],
            });
        }).toThrow('Event date must be in the future');
    });

    it('should throw if organiser is not an organiser', () => {
        const notOrg = new User({
            id: 2,
            firstName: 'Bob',
            lastName: 'Jones',
            email: 'bob@example.com',
            password: 'password123',
            isOrganiser: false,
        });
        expect(() => {
            new Event({
                name: 'Name',
                description: 'Desc',
                date: new Date(Date.now() + 1000),
                location: 'Loc',
                organiser: notOrg,
                createdAt: new Date(),
                updatedAt: new Date(),
                attendees: [],
            });
        }).toThrow('User must have organiser role to organise events');
    });

    it('throws on date conflict when organiser already has an event on that date', async () => {
        // Mock service to return an existing event on that date
        (eventDB.getEventsByOrganiserId as jest.Mock).mockResolvedValue([mockEvent]);

        await expect(
            eventService.createEvent({
                name: 'Another Event',
                description: 'Desc',
                date: mockEvent.getDate(),
                location: 'Other Place',
                organiserId: 1,
            })
        ).rejects.toThrow('You already have an experience on this date.');

        // Should NOT call createEvent on the DB in the conflict case
        expect(eventDB.createEvent).not.toHaveBeenCalled();
    });
});

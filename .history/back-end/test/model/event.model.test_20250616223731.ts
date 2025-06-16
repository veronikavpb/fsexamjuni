// test/service/event.test.ts

import eventService from '../../service/event.service';
import eventDB from '../../repository/event.db';
import { Event } from '../../model/event';
import { User } from '../../model/user';

// Mock the repository at the correct path
jest.mock('../../repository/event.db');

describe('Event Model', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    const mockOrganiser = new User({
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        password: 'password123',
        isOrganiser: true,
    });

    it('should create a valid Event', () => {
        const evt = new Event({
            id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'Test Event',
            description: 'A valid description',
            date: futureDate,
            location: 'Test Location',
            organiser: mockOrganiser,
            attendees: [],
        });
        expect(evt.getName()).toBe('Test Event');
        expect(evt.getDate().getTime()).toBe(futureDate.getTime());
        expect(evt.getOrganiser().getEmail()).toBe('alice@example.com');
    });

    it('should throw if name is empty', () => {
        expect(() => {
            new Event({
                id: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
                name: '   ',
                description: 'desc',
                date: futureDate,
                location: 'loc',
                organiser: mockOrganiser,
                attendees: [],
            });
        }).toThrow('Event name is required');
    });

    it('should throw if date is not in the future', () => {
        expect(() => {
            new Event({
                id: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Name',
                description: 'Desc',
                date: new Date(Date.now() - 1000),
                location: 'Loc',
                organiser: mockOrganiser,
                attendees: [],
            });
        }).toThrow('Event date must be in the future');
    });

    it('should throw if organiser is not an organiser', () => {
        const notOrg = new User({
            id: 4,
            firstName: 'Bob',
            lastName: 'Jones',
            email: 'bob@example.com',
            password: 'password123',
            isOrganiser: false,
        });
        expect(() => {
            new Event({
                id: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Name',
                description: 'Desc',
                date: futureDate,
                location: 'Loc',
                organiser: notOrg,
                attendees: [],
            });
        }).toThrow('User must have organiser role to organise events');
    });
});

describe('Event Service', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    const mockOrganiser = new User({
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        password: 'password123',
        isOrganiser: true,
    });
    const mockEvent = new Event({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Mock Event',
        description: 'Mock description',
        date: futureDate,
        location: 'Mock Location',
        organiser: mockOrganiser,
        attendees: [],
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('lists all events', async () => {
        (eventDB.getAllEvents as jest.Mock).mockResolvedValue([mockEvent]);
        const all = await eventService.getAllEvents();
        expect(all).toHaveLength(1);
        expect(all[0]).toBeInstanceOf(Event);
    });

    it('lists by organiser ID', async () => {
        (eventDB.getEventsByOrganiserId as jest.Mock).mockResolvedValue([mockEvent]);
        const byOrg = await eventService.getEventsByOrganiserId({ organiserId: 1 });
        expect(byOrg[0].getOrganiser().getId()).toBe(1);
    });

    it('creates a new event when no date conflict', async () => {
        (eventDB.getEventsByOrganiserId as jest.Mock).mockResolvedValue([]);
        (eventDB.createEvent as jest.Mock).mockResolvedValue(mockEvent);

        const created = await eventService.createEvent({
            name: mockEvent.getName(),
            description: mockEvent.getDescription(),
            date: mockEvent.getDate(),
            location: mockEvent.getLocation(),
            organiserId: 1,
        });

        expect(created.getName()).toBe('Mock Event');
    });

    it('throws on date conflict when organiser already has an event on that date', async () => {
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

        expect(eventDB.createEvent).not.toHaveBeenCalled();
    });
});

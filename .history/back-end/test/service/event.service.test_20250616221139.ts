import eventService from '../service/event.service';
import eventDB from '../repository/event.db';
import { Event } from '../model/event';
import { User } from '../model/user';

jest.mock('../repository/event.db');

describe('Event Service', () => {
    const mockDate = new Date(Date.now() + 1000 * 60 * 60);
    const mockEvent = new Event({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Mock Event',
        description: 'Mock description',
        date: mockDate,
        location: 'Mock Loc',
        organiser: new User({
            id: 1,
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@example.com',
            password: 'password123',
            isOrganiser: true,
        }),
        attendees: [],
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should list all events', async () => {
        (eventDB.getAllEvents as jest.Mock).mockResolvedValue([mockEvent]);
        const all = await eventService.getAllEvents();
        expect(Array.isArray(all)).toBe(true);
        expect(all[0]).toBeInstanceOf(Event);
    });

    it('should list by organiser ID', async () => {
        (eventDB.getEventsByOrganiserId as jest.Mock).mockResolvedValue([mockEvent]);
        const byOrg = await eventService.getEventsByOrganiserId({ organiserId: 1 });
        expect(byOrg.every((e) => e.getOrganiser().getId() === 1)).toBe(true);
    });

    it('should create a new event when no conflict', async () => {
        (eventDB.getEventsByOrganiserId as jest.Mock).mockResolvedValue([]);
        (eventDB.createEvent as jest.Mock).mockResolvedValue(mockEvent);
        const created = await eventService.createEvent({
            name: mockEvent.getName(),
            description: mockEvent.getDescription(),
            date: mockEvent.getDate(),
            location: mockEvent.getLocation(),
            organiserId: mockEvent.getOrganiser().getId()!,
        });
        expect(created).toBeInstanceOf(Event);
        expect(created.getName()).toBe(mockEvent.getName());
    });

    it('should throw on date conflict', async () => {
        (eventDB.getEventsByOrganiserId as jest.Mock).mockResolvedValue([mockEvent]);
        await expect(
            eventService.createEvent({
                name: 'Another',
                description: 'Desc',
                date: mockEvent.getDate(),
                location: 'Loc2',
                organiserId: 1,
            })
        ).rejects.toThrow('You already have an event on this date.');
    });
});

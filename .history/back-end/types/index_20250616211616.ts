type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isOrganiser: boolean;
};

type AuthenticationResponse = {
    token: string;
    id: number;
    firstName: string;
    lastName: string;
    role: 'ORGANISER' | 'CLIENT';
};

type Experience = {
    id: number;
    name: string;
    description: string;
    date: string; // ISO string from server
    location: string;
    organiser: {
        firstName: string;
        lastName: string;
    };
};

type StatusMessage = {
    message: string;
    type: 'error' | 'success';
};

type LoggedInUser = {
    id: number;
    token: string;
    firstName: string;
    lastName: string;
    role: 'ORGANISER' | 'CLIENT';
};

export { UserInput, AuthenticationResponse, Experience, StatusMessage, LoggedInUser };

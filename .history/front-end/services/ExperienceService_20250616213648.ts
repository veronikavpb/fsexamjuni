import { Experience } from "@types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const getToken = (): string => {
  const loggedInUserString = sessionStorage.getItem("loggedInUser");
  return loggedInUserString ? JSON.parse(loggedInUserString).token : "";
};

const getAllExperiences = (): Promise<Response> => {
  return fetch(`${API_BASE}/events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

const getExperiencesByOrganiser = (organiserId: number): Promise<Response> => {
  return fetch(`${API_BASE}/events/organiser/${organiserId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

const createExperience = (experience: {
  name: string;
  description: string;
  date: string;
  location: string;
  organiserId: number;
}): Promise<Response> => {
  return fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(experience),
  });
};

const ExperienceService = {
  getAllExperiences,
  getExperiencesByOrganiser,
  createExperience,
};

export default ExperienceService;

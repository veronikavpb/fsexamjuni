import { User } from "@types";

const loginUser = (credentials: { email: string; password: string }) => {
  return fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
};

const UserService = {
  loginUser,
};

export default UserService;

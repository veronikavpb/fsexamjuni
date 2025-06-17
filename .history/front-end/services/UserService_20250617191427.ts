import { User } from "@types";

const loginUser = (credentials: { email: string; password: string }) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/login`;
  console.log("👉 loginUser will call:", url);
  return fetch(url, {
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

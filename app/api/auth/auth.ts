import { postData } from "../strapi";




//Regiter a user
const regiter = await postData(
  "/api/auth/local/register",
  {
    username: "ijaz khan",
    email: "csijaz@gmail.com",
    password: "Ejazkhan",
  }
);


// Login user 
const login = await postData(
  "/api/auth/local",
  {
    identifier: "csijaz@gmail.com",
    password: "Ejazkhan",
  }
);
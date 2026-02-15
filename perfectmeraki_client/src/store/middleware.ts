import { Middleware } from "redux";

const logger: Middleware = () => (next) => (action) => {
  console.log("dispatching", action);
  return next(action);
};

export const middleware = [logger];

const {
          AuthenticationError,
      } = require('apollo-server');

const requireLogged = (next, source, args, {user}) => {
    if (!user) throw new AuthenticationError("Access denied");
    return next();
};

export default requireLogged;
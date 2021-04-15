const expressJwt = require('express-jwt');

const getToken = headers => headers.authorization.split(' ')[1];

const authorize = (roles = []) => {
  const publicKey = Buffer.from(process.env.PUBLIC_KEY, 'base64');

  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])

  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to requset object (req.user)
    expressJwt({
      secret: publicKey,
      algorithms: ['sha1', 'RS256', 'HS256']
    }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(401).send({ message: 'Unauthorized' });
      }

      //  authentication and authorization successful
      next();
    }
  ];
};

module.exports = { authorize, getToken };

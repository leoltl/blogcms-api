const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

module.exports = function makePassport(findUserInDB) {
  async function jwtStrategyImpl(req, jwt_payload, done) {
    try {
      const user = await findUserInDB({ _id: jwt_payload.sub })
        .select('-password_hash -salt').exec();
      done(null, (user || false));
    } catch (e) {
      console.log(e)
      done(e, false);
    }
  }

  const jwtStratOption = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER || 'blogcms-api.com',
    passReqToCallback: true,
  }

  // hookup passport to JWTStrategy
  passport.use(new JwtStrategy(jwtStratOption, jwtStrategyImpl));

  // overwrite passport.authenticate with customize authenticate function
  passport.authenticate = function (strategy, options, callback) {
    const authenticateMiddleware = passport.__proto__.authenticate.bind(passport)(strategy, options, callback);

    return function(req, res, next) {
      if (req.originalUrl.match(/^\/api\/post/) && req.method === 'GET') {
        // if token is not include in request, skip authentication and set user to null.
        const jwt_payload = jwtStratOption.jwtFromRequest(req);
        if (!jwt_payload) {
          req.user = null;
          return next();
        }
      }

      // call original jwt passport authenticate middleware
      authenticateMiddleware(req, res, next);
    }
  }

  
  return passport;
}

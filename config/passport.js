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

  /* add additional method, if jwt is attached, call the original jwt passport authenticate middleware,
     otherwise skip jwt verification step and set req.user to null */
  passport.optionalAuthenticate = function (strategy, options, callback) {
    const authenticate = passport.authenticate(strategy, options, callback);

    return function(req, res, next) {
      const jwt_payload = jwtStratOption.jwtFromRequest(req);
      if (!jwt_payload) {
        req.user = null;
        return next();
      }

      // otherwise call original jwt passport authenticate middleware
      authenticate(req, res, next);
    }
  }
  
  return passport;
}

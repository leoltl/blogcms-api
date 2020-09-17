const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

module.exports = function (passport, findUserInDB) {
  async function jwtStrategyImpl(jwt_payload, done) {
    try {
      const user = await findUserInDB({ _id: jwt_payload.sub })
        .select('-password_hash -salt').exec();
      done(null, (user || false));
    } catch (e) {
      done(e, false);
    }
  }

  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER || 'blogcms-api.com',
  }

  // hookup passport to JWTStrategy
  passport.use(new JwtStrategy(options, jwtStrategyImpl));
}

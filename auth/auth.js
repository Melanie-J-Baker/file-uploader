const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const db = require("../db/queries");
const bcrypt = require('bcryptjs');

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.getUserByUsername(username);
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const compare = await bcrypt.compare(hashedPassword, user.password)
            if (!compare) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserByID(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});

module.exports = passport;
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

export const passportSetup = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                // Use full URL for callbackURL
                callbackURL: "http://localhost:5001/auth/google/callback",  // Ensure this matches your Google Developer Console
                scope: ["profile", "email"],
            },
            (accessToken, refreshToken, profile, callback) => {
                callback(null, profile);
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};

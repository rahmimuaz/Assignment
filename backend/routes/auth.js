import express from "express";
import passport from "passport";

const router = express.Router();

// Your authentication routes (already shown before)
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            user: req.user,
        });
    } else { 
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Login failure",
    });
});

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: "/login/failed",
    })
);

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL);
});

export default router;  // Make sure this is exporting the router

const passport = require('passport');                               //https://www.npmjs.com/package/passport
const webAppStrategy = require('ibmcloud-appid').WebAppStrategy;    //https://www.npmjs.com/package/ibmcloud-appid
const authConfig = require('./auth-config');

module.exports = {
    addAuthenticationRoutes: function (app) {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((user, cb) => cb(null, user));
        passport.deserializeUser((user, cb) => cb(null, user));

        let frontEndConfig = [];

        Object.keys(authConfig).forEach(key => {
            let config = authConfig[key];
            let loginPath = "/appid/login_" + key;
            let callbackPath = "/appid/callback_" + key;
            config.redirectUri = "http://localhost:3001" + callbackPath;
            let strategy = new webAppStrategy(config);
            strategy.name += key;
            passport.use(strategy);

            app.get(loginPath, passport.authenticate(strategy.name, {
                forceLogin: true, successRedirect: "/"
            }));

            app.get(callbackPath, passport.authenticate(strategy.name));

            frontEndConfig.push({
                displayName: config.displayName,
                loginPath: loginPath
            });
        });

        app.get("/appid/frontendconfig", (req, res, next) => {
            return res.json(frontEndConfig);
        });

        app.get("/appid/logout", function (req, res) {
            webAppStrategy.logout(req);
            res.redirect("/")
        });
    }
};
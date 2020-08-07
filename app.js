const express = require('express');                                 //https://www.npmjs.com/package/express
const app = express();
const session = require('express-session');                         //https://www.npmjs.com/package/express-session
const authManager = require('./auth-manager');

app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true
}));


/*passport.use(new webAppStrategy({
    clientId: "f19636f3-d191-4687-bff3-f9995a342e5e",
    tenantId: "d039e7b2-3f20-4836-9aad-3eeb8ef27e9f",
    secret: "NmJhMmRiNGEtNjBhNC00N2E4LWFiZTQtMjk5YTZmZmRlZWQ1",
    oAuthServerUrl: "https://eu-gb.appid.cloud.ibm.com/oauth/v4/d039e7b2-3f20-4836-9aad-3eeb8ef27e9f",
    redirectUri:"http://localhost:3001/appid/callback"
}));*/

//handle call back
//app.get("/appid/callback",passport.authenticate(webAppStrategy.STRATEGY_NAME));

//handle login
/*app.get("/appid/login",passport.authenticate(webAppStrategy.STRATEGY_NAME,{
    successRedirect:"/",
    forceLogin:true
}));*/

//handle logout
/*app.get("/appid/logout",function (req,res) {
    webAppStrategy.logout(req);
    res.redirect("/")
});*/

authManager.addAuthenticationRoutes(app);

app.use("/api",function(req,res,next){
    if(req.user){
        next();
    }else{
        res.status(401).send("unauthorized");
    }
});

app.get("/api/user",(req,res)=>{
    res.json({
        user:{
            name:req.user.name
        }
    })
});

//protect whole app
//app.use(passport.authenticate(webAppStrategy.STRATEGY_NAME));

//serve static resource
app.use(express.static('./public'));

//start server
app.listen(3001, () => {
    console.log("app listening on http://localhost:3001")
});
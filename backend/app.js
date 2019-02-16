const express = require("express");

const commonMW = require("./middlewares/default-mw"); //default middlewares
const { sessionCounterMW, sessionMgmtMW } = require("./middlewares/sessions");
const { authBySession } = require("./middlewares/auth-mw"); //authentication middlewares
const path = require("path");

const app = express();
app.use(commonMW);
app.use(express.static(path.join(__dirname, process.argv[2] || "./static")));

/* for registration */
const registerRouter = require("./routes/register");
app.use("/register", registerRouter);

/* for login */
const loginRouter = require("./routes/login");
app.use("/login", loginRouter);

app.use([sessionMgmtMW, sessionCounterMW]);

const wsRef = require("express-ws")(app); //give app the ability to use WS
app.use("/ws", authBySession, require("./routes/websockets"));

const homepageRouter = require("./routes/homepage");

const usersRouter = require("./routes/users");
const meRouter = require("./routes/me");
app.use("/", homepageRouter);

app.use("/users", authBySession, usersRouter);
app.use("/me", authBySession, meRouter);

app.listen(3000);

module.exports = app;

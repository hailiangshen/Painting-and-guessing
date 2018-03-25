const app = require("../app.js");
const debug = require("debug")("nodeservertest:server");
const http = require("http");
const chalk = require("chalk");
const SocketIO = require("socket.io");
const socketHandler = require("../socket/paintingAndGuessing");
// const opn = require("opn");

var port = normalizePort(process.env.PORT || "80");
app.set("port", port);

var server = http.createServer(app);
var io = SocketIO(server);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
// opn(`http://localhost:${port}`);

io.use((socket, next) => {
    // let token = socket.handshake.query.token;
    // if (token) {
    //     return next();
    // }
    // return next(new Error("authentication error"));
    next();
});
io.of("/painting-and-guessing").on("connection", socketHandler);

console.info(chalk.greenBright(`start listening -> ${port}`));

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}

const express = require("express");
require("express-async-errors")

const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const  helmet = require("helmet");
const routes = require("./routes");
// const unKnownEndpoint = require("./middleware/unKnownEndpoint");
// const {handleError} = require("./helpers/error");
const bodyParser = require('body-parser');

const app = express();

app.set("trust proxy", 1);


app.use(bodyParser.json({ limit: '50mb' })); // Increase limit to 50 MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 
app.use(cors({credentials:true, origin:true}));
app.use(express.json());
// app.use(bodyParser.json());

// GET /api/users 200 10ms
app.use(morgan("dev"));

// compresses the response sent by http , which increase the performance 
app.use(compression());

// provide security headers in http request
app.use(helmet());
app.use(cookieParser());

// Middleware to set COOP and COEP headers
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("<h1 style = 'text-align:center'>API</h1>");
});
// app.use(unKnownEndpoint);
// app.use(handleError);

module.exports = app;
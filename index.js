const express = require("express");
const cors = require("cors");
require("dotenv").config();


const logger = require("./middleware/logger");
const responseHandler = require("./middleware/responseHandler");
// const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
// app.use(rateLimiter);
app.use(responseHandler);

app.use("/api", routes);

// instead applying on sensative routes
// const rateLimiter = require("./middleware/rateLimiter");
// app.use(rateLimiter);

app.get("/", (req, res) => {
    res.send("POS Backend Running");
});

// After routes
app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

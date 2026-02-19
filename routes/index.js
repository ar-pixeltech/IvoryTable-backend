// const express = require("express");
// const router = express.Router();

// const adminRoutes = require("./admin.routes");
// const vendorRoutes = require("./vendor.routes");
// const subscriptionRoutes = require("./subscription.routes");

// // Attach routes with prefix
// router.use("/admin", adminRoutes);
// router.use("/vendor", vendorRoutes);
// router.use("/subscription", subscriptionRoutes);

// module.exports = router;

// automatically load all route files in the current directory  
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

fs.readdirSync(__dirname).forEach(file => {
    if (file !== "index.js") {
        const route = require(path.join(__dirname, file));
        const routeName = file.split(".")[0]; // admin.routes -> admin
        router.use(`/${routeName.replace(".routes", "")}`, route);
    }
});

module.exports = router;

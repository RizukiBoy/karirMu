const cors = require ("cors");

const express = require("express");
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const companyDocument = require("./routes/companyDocumentRoutes")
const superAdminRoute = require("./routes/superAdminRoute")
const jobRoutes = require("./routes/jobRoutes");
const publicRoutes = require("./routes/publicRoutes")
const jobFieldRoutes = require("./routes/jobFieldRoute");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("test");
});


app.use(cors({
  origin: "http://localhost:5173",
}));

app.use("/api/job-field", jobFieldRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/public", publicRoutes)
app.use("/api/user", userRoutes)
app.use("/api", jobRoutes)
app.use("/api/admin-aum", companyDocument, jobRoutes)
app.use("/api/admin", superAdminRoute)



module.exports = app;

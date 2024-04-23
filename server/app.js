const express = require("express");
const app = express();
require("dotenv").config();


app.use(express.json());

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer") ? auth.slice(7) : null;

  try {
    req.user = jwt.verify(token, process.env.JWT || "donttell");
  } catch (error) {
    req.user = null;
  }
  next()
})
// AFTER LUNCH LETS MAKE MY API ROUTE SO I CAN FILL IN THE DELETE POST FUNCTION
app.use("/auth", require("./auth/index.js"))
app.use("/api/v1", require("./api/index.js"))



module.exports = app;
const express = require("express")
const morgan = require('morgan')
const cors = require("cors")
const jwt = require("express-jwt")
const jwksRsa = require("jwks-rsa")
require("dotenv").config()

const app = express()

app.use(morgan("dev"))

let corsOptions = {
  origin: "http://localhost:8081",
}
app.use(cors(corsOptions))

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: [`https://${process.env.AUTH0_DOMAIN}/`],
  algorithms: ["RS256"],
})

app.get("/public", (req, res) => {
  res.status(200).send("hello public")
})

app.get("/private", jwtCheck, (req, res) => {
  res.status(200).send("hello private")
})

app.get("*", (req, res) => {
  res.sendStatus(404)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`api started on port ${PORT}`)
})

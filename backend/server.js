require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path')

const app = express();

// midellware to handel  cores
app.use(
  cors({
    origin:process.env.CLINT_URL||"*",
    methods:["GET","POST" , "PUT", "DELETE"],
    allowedHeaders:["Content-Type" , "Authorization"],
  })
)
// midelware
app.use(express.json());


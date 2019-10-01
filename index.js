require("dotenv").config();
const express = require("express");
const app = express();

const Note = require("./models/note");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000/"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello Worldfasfasfs!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes.map(note => note.toJSON()));
  });
});

app.get("/api/notes/:naziv", (request, response) => {
  Note.find({ naziv: { $eq: request.params.naziv } }).then(note => {
    response.json(note);
  });
});

app.post("/api/form", (req, res) => {
  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "apikey", //  user
        pass:
          "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" //  password
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `${req.body.email}`, // sender address
      to: "misko.199613@gmail.com", // list of receivers
      // subject: `${req.body.username}`, // Subject line
      text: `broj:${req.body.phoneNumber}`, // plain text body
      html: `<b>${req.body.naziv}, Ime:${req.body.username}, E-mail: ${req.body.email}</b>` // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }

  main().catch(console.error);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

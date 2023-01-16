require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGOATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  // mongoose
  //   .connect("mongodb://127.0.0.1:27017/notesDB", {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   })
  .then(() => {
    console.log("Connected to Mongo");
  })
  .catch((err) => {
    console.log("Mongo Connection Error");
    console.log(err);
  });
//

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model("Note", noteSchema);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app
  .route("/notes")
  .get((req, res) => {
    Note.find(function (err, foundNotes) {
      if (!err) {
        res.send(foundNotes);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const note = new Note({
      title: req.body.title,
      content: req.body.content,
    });

    note.save(function (err) {
      if (!err) {
        res.send(note);
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Note.findOneAndDelete({ _id: req.body._id }, function (err, deletedNote) {
      if (!err) {
        res.send("Succesfully Deleted Note");
      } else {
        res.send(err);
      }
    });
  });

app.listen(process.env.PORT || 5000, () => {
  console.log("The server started on port 5000");
});

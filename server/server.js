const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose")

const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("../client/keeper-app/public"));


// const for DB
const url = "mongodb://localhost:27017/";
const dbName = "keeper-db";
const opts = "";

mongoose.set('debug', true);
// create DB connection string
const connectStr = url + dbName + opts;

// create a new DB
mongoose.connect(connectStr, {useNewUrlParser: true});

// create a new Schema
const noteSchema = new mongoose.Schema( 
    {
        title: String,
        content: String,
    }
);

// create a new Model
const Note = mongoose.model("Note", noteSchema);

////////////
// Routes for generic notes
//
////

app.route("/notes")
    .get(async function (req, res) {
        try {
            const docs = await Note.find({}, null);
            res.send(docs);
        } catch (err) {
            res.send(err);
        }
    
})
    .post(async function (req, res) {
        // const id = req.body.id;
        try {
            const savedDoc = await new Note({ title: req.body.title, content: req.body.content }).save()
            const newId = (savedDoc._id.toString());
            return res.status(201).json({
                success: true,
                id: newId,
                message: 'Note created!'
            })
        } catch (err) {
            console.log(err);
        }

    })


////////////
// Routes for specific notes
//
////
app.route("/notes/:id")
    .put(async function (req, res) {
        console.log("**** app.route().put");
        console.log(req.body.title + " " + req.body.content + " " + req.body.oldTitle + " " + req.body.oldContent);
        console.log("id = " + req.params.id);
        // Note.findOneAndReplace(
        // { $and: [ { title: req.body.oldTitle }, { content: req.body.oldContent } ] },
        try {
            await Note.findByIdAndUpdate((req.params.id),
                {
                    title: req.body.title,
                    content: req.body.content,
                    id: req.params.id
                }
            )
            res.send("note successfully replaced");
        } catch (err) {
            res.send(err);
        }
    })
.delete(async function(req, res) {
    // Note.findOneAndDelete(
    // { $and: [ { title: req.body.title }, { content: req.body.content } ] }
    console.log("deleting note id = " + req.params.id);
    try {
        await Note.findByIdAndDelete((req.params.id));
        res.send("note successfully deleted");
    } catch (err) {
        err => res.send(err)
    }
    
});


app.listen(5000, () => {
    console.log("Server started on port 5000");
});


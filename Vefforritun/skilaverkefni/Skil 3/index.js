//Sample for Assignment 3
const express = require('express');

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');

//Use cors to avoid issues with testing on localhost
const cors = require('cors');

const app = express();

//Port environment variable already set up to run on Heroku
let port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());  

//Set Cors-related headers to prevent blocking of local requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//The following is an example of an array of two tunes.  Compared to assignment 2, I have shortened the content to make it readable
var tunes = [
    { id: '0', name: "Für Elise", genreId: '1', content: [{note: "E5", duration: "8n", timing: 0},{ note: "D#5", duration: "8n", timing: 0.25},{ note: "E5", duration: "8n", timing: 0.5},{ note: "D#5", duration: "8n", timing: 0.75},
    { note: "E5", duration: "8n", timing: 1}, { note: "B4", duration: "8n", timing: 1.25}, { note: "D5", duration: "8n", timing: 1.5}, { note: "C5", duration: "8n", timing: 1.75},
    { note: "A4", duration: "4n", timing: 2}] },

    { id: '3', name: "Seven Nation Army", genreId: '0', 
    content: [{note: "E5", duration: "4n", timing: 0}, {note: "E5", duration: "8n", timing: 0.5}, {note: "G5", duration: "4n", timing: 0.75}, {note: "E5", duration: "8n", timing: 1.25}, {note: "E5", duration: "8n", timing: 1.75}, {note: "G5", duration: "4n", timing: 1.75}, {note: "F#5", duration: "4n", timing: 2.25}] }
];

let genres = [
    { id: '0', genreName: "Rock"},
    { id: '1', genreName: "Classic"}
];

const mainURL = '/api/v1';
let nextTuneId = 4;
let nextGenreId = 2;

function tuneGenreMatch(tuneId, genreId) {
    tunesInGenre = []
    for (let i=0; i<tunes.length; i++) { // to check if the tune is in specified genre
        let tune = tunes[i];
        if (tune.genreId == genreId) {
            tunesInGenre.push(tune.id)
        }
    }

    for (let i=0; i<tunes.length; i++) { // checks if tune exists 
        let tune = tunes[i];
        if (tune.id == tuneId && tunesInGenre.includes(tune.id)) {
            return tune;
        }
    }
    return false;
}

//Your endpoints go here

// Tunes endpoints:
// 1. Read all tunes - return an array of all tunes 
app.get(mainURL + '/tunes', (req, res) => {
    let retArray = [];

    if (Object.keys(req.query).length == 1 && 'name' in req.query) { // if the filter is used

        var genreId = false
        for (let i=0; i<genres.length; i++) { // Finds the genreId

            if (req.query.name == genres[i].genreName) {
                var genreId = genres[i].id
            }
        }

        if (!genreId === false) { // finds the tunes in the specified genre
            for (let i=0; i<tunes.length; i++) {
                if (tunes[i].genreId == genreId) {
                    retArray.push({id: tunes[i].id, name: tunes[i].name, genreId: tunes[i].genreId});
                }
            }
        }
       
    } 

    else { // if the filter is not used
        for (let i=0; i<tunes.length; i++) {
            let tune = tunes[i];
            retArray.push({id: tune.id, name: tune.name, genreId: tune.genreId});
        }
    };
    res.status(200).json(retArray);
})


// 2. Read an individual tunes - Returns all attributes of a specified tune.
app.get(mainURL + "/genres/:genreId/tunes/:tuneId", (req, res) => {
    let tune = tuneGenreMatch(req.params.tuneId, req.params.genreId)
    if (tune === false) {
        res.status(404).json({message: "Tune with tuneId " + req.params.tuneId + " and genreId " + req.params.genreId + " does not exist."});
        return;
    }
    else {
        res.status(200).json(tune);
        return;
    }
})

// 3. Create a new tune
app.post(mainURL + "/genres/:genreId/tunes", (req, res) => {
    if (req.body === undefined || req.body.name === undefined || req.body.content === undefined) { // checks if body is defined
        res.status(400).json({message: "Name and content is required in the request body."});
        return;
    }

    let content = req.body.content;
    if (!content.length > 0) { // checks if the content list is empty
        res.status(400).json({message: "The content of a tune must be have at least 1 note."});
        return;
    }

    for (let i=0; i<content.length; i++) { // checks if each note of the content list includes, name (str) duration (str) and timing (number)
        if (!content[i].length === 3 || !content[i].hasOwnProperty('note') || !content[i].hasOwnProperty('duration') || !content[i].hasOwnProperty('timing')) {
            res.status(400).json({message: "Note, duration and timing must be in each object of the tune content."}); 
            return;
        }

        if ((typeof content[i].note === 'string') === false || (typeof content[i].duration === 'string') === false || (typeof content[i].timing === 'number') === false) {
            res.status(400).json({message: "Note and duration must be of type string, timing must be of type number"}); 
            return;
        }

    }

    genreExists = false; // checks if the genre id exists in the genre object
    for (let i=0; i<genres.length; i++) {
        if (genres[i].id == req.params.genreId) {
            genreExists = true;
        }
    }
    if (genreExists === false) {
        res.status(404).json({message: "Genre with id: " + req.params.genreId + ", does not exist."}); 
        return;
    }

    let retObject = {id: nextTuneId.toString(), name: req.body.name, genreId: req.params.genreId, content: req.body.content};
    tunes.push(retObject);
    nextTuneId++
    res.status(201).json(retObject);
})

// 4. Partially update a tune
const allowed_changes = ['name', 'genreId', 'content'];

app.patch(mainURL + "/genres/:genreId/tunes/:tuneId", (req, res) => { 
    if (req.body === undefined) { // checks if body is defined
        res.status(400).json({message: "Request body must be defined."});
        return;
    }

    let tune = tuneGenreMatch(req.params.tuneId, req.params.genreId) // check if the genreId and tuneId match
    if (tune === false) {
        res.status(404).json({message: "Tune with tuneId " + req.params.tuneId + " and genreId " + req.params.genreId + " does not exist."});
        return;
    }

    let keys = Object.keys(req.body)
    if (!keys.every(key => allowed_changes.includes(key))) { // check if changes that are sent in are allowed
        res.status(400).json({message: "You can only update name, genre or content of a tune."});
        return;
    }

    if (keys.includes('name')) { // ----------------------- to update name
        tune.name = req.body.name
    }

    if (keys.includes('genreId')) { // -------------------- to update genre
        genreExists = false; // checks if the genre id exists in the genre object
        for (let i=0; i<genres.length; i++) {
            if (genres[i].id == req.body.genreId) {
                genreExists = true;
            }
        }
        if (genreExists === true) {
            tune.genreId = req.body.genreId.toString()
        }
        else {
            res.status(404).json({message: "Genre Id does not exist"});
            return;
        }
    }

    if (keys.includes('content')) { // -------------------- to update content
        let content = req.body.content;
        if (!content.length > 0) { // checks if the content list is empty
            res.status(400).json({message: "The content of a tune must be have at least 1 note."});
            return;
        }
    
        for (let i=0; i<content.length; i++) { // checks if each note of the content list includes, name (str) duration (str) and timing (number)
            if (!content[i].length === 3 || !content[i].hasOwnProperty('note') || !content[i].hasOwnProperty('duration') || !content[i].hasOwnProperty('timing')) {
                res.status(400).json({message: "Note, duration and timing must be in each object of the tune content."}); 
                return;
            }
    
            if ((typeof content[i].note === 'string') === false || (typeof content[i].duration === 'string') === false || (typeof content[i].timing === 'number') === false) {
                res.status(400).json({message: "Note and duration must be of type string, timing must be of type number"}); 
                return;
            }
        }
        tune.content = req.body.content
    }
    
    res.status(200).json(tune);
})

// Genres endpoints:

// 1. Read all genres - returns an array of all genres
app.get(mainURL + '/genres', (req, res) => {
    let retArray = [];
    for (let i=0; i<genres.length; i++) {
        retArray.push(genres[i]); 
    }
    res.status(200).json(retArray);
})

// 2. Create a new genre
app.post(mainURL + '/genres', (req, res) => {
    if (req.body === undefined || req.body.genreName === undefined || !Object.keys(req.body).length === 1 ) { // checks if body is defined
        res.status(400).json({message: "Only genreName is required in the request body."});
        return;
    }

    for (let i=0; i<genres.length; i++) { // checks if the name is a duplicate
        if (genres[i].genreName === req.body.genreName) {
            res.status(400).json({message: "Duplicate names for genres are not allowed."});
            return;
        }
    }

    let new_genre = {id: nextGenreId.toString(), genreName: req.body.genreName}
    genres.push(new_genre);
    nextGenreId++;
    res.status(201).json(new_genre);
})

// 3. Delete a genre
app.delete(mainURL + '/genres/:genreId', (req, res) => {
    genreExists = false; // checks if the genre id exists in the genre object
    for (let i=0; i<genres.length; i++) {
        if (genres[i].id == req.params.genreId) {
            genreExists = true;
            deleteGenreIndex = i;
        }
    }
    if (genreExists === false) {
        res.status(404).json({message: "Genre with id: " + req.params.genreId + ", does not exist."}); 
        return;
    }

    for (let i=0; i<tunes.length; i++) { // check if there are tunes in the genre that is being deleted
        if (tunes[i].genreId === req.params.genreId) {
            res.status(400).json({message: "Can not delete a genre that has tunes in it."})
            return;
        }
    }

    let retArray = genres.splice(deleteGenreIndex, 1);
    res.status(200).json(retArray[0]);
})


// unsupported 
app.use('*', (req, res) => {
    res.status(405).json({message: 'Operation not supported'});
})


//Start the server
app.listen(port, () => {
    console.log('Tune app listening on port + ' + port);
});

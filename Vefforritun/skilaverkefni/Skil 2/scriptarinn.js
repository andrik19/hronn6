const keyboard = {'a': 'c4', 
                'w': 'c#4', 
                's': 'd4', 
                'e': 'd#4', 
                'd': 'e4', 
                'f': 'f4', 
                't': 'f#4', 
                'g': 'g4', 
                'y': 'g#4', 
                'h': 'a4', 
                'u': 'bb4', 
                'j': 'b4', 
                'k': 'c5', 
                'o': 'c#5', 
                'l': 'd5', 
                'p': 'd#5', 
                ';': 'e5',
                'æ': 'e5'
                };
var song_dict = {}; 
var highest_id = 0; // so we can make new id's, by always adding 1 to the highest
var SYNTH = new Tone.Synth().toDestination(); // Initializes the piano synth 

var isRecording = false; 
var recNotes  // the notes that are recorded in each recording
var startTime // take the time when the recording started, (Date.now() - startTime)/1000 gives the timing on the notes

// Play the piano key sounds 
function playSound(key_name, length, time) {
    var now = Tone.now();
    SYNTH.triggerAttackRelease(key_name, length, time+now);

    if (isRecording) { // if it's recording, we save it to recNotes
        recNotes.push({'note': key_name, 'duration': '8n', 'timing': (Date.now()-startTime)/1000})
    }
}

function initTuneList() {
    var url = "https://veff2022-h1.herokuapp.com/api/v1/tunes"

    //Perform a GET request to the url
    axios.get(url)
    .then(function (response) {

        console.log("Success: ", response.data);

        for (var i=0;i<response.data.length;i++) {
            console.log("Tune name: " + response.data[i].name);

            addTuneDropOption(response.data[i].name, response.data[i].id); // adds the song to the tune drop 
            song_dict[response.data[i].id] = response.data[i].tune; // adds the songs keys to the song_dict object by id

            if (response.data[i].id > highest_id) { // keeps info about the id, so we can generate new id's
                highest_id = response.data[i].id
            }

        }
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
    });
}

function addTuneDropOption(name, id_num) {
    var tunedrop = document.getElementById("tunesDrop");
    var option = document.createElement("option");
    option.text = name;
    option.id = id_num; // gets a distinct id, so it can be found in playSong()
    tunedrop.add(option);
}

// 1. Make tones play when you push the piano buttons using the mouse.
document.getElementById("keyboardDiv").addEventListener("mousedown", function(e) {
    playSound(e.target.id, "8n", 0);
})

// 2. Make tones play when you push the keyboard buttons.
document.addEventListener("keydown", function(e) {
    if ((Object.hasOwn(keyboard, e.key)) && !(e.target.type == "text")) { // the key is on the piano and we are not in the textbox

        playSound(keyboard[e.key], "8n", 0)
        document.getElementById(keyboard[e.key]).classList.add("active")
    }
})

document.addEventListener("keyup", function(e) {
    if (Object.hasOwn(keyboard, e.key)) {
        document.getElementById(keyboard[e.key]).classList.remove("active")
    }
})

// 3. Contact the backend to receive existing tunes, and make them appear in the dropdown menu.
initTuneList(); 

// 4. Play existing tunes when the play button is pressed.
function playSong() {
    var tuneDropOptions = document.getElementById("tunesDrop");
    var songKey = tuneDropOptions[tuneDropOptions.selectedIndex].id;

    for (var i=0; i<song_dict[songKey].length; i++) {

        var key = song_dict[songKey][i].note.toLowerCase(); // since the ids are lowercase, we need to make the keys from the backend lowercase
        var length = song_dict[songKey][i].duration;
        var time = song_dict[songKey][i].timing;

        playSound(key, length, time);
    }
}

// 5. Record tunes and play them locally
function generateNewId() {
    highest_id = parseInt(highest_id) + 1
    return highest_id
}

function startRecord() {
    isRecording = true;
    recNotes = []
    startTime = Date.now()

    document.getElementById("recordbtn").disabled = true;
    document.getElementById("stopbtn").disabled = false;
}

function stopRecord() {
    isRecording = false;
    uploadSong();
}

function uploadSong() {
    var id = generateNewId(); // creates a new id for the song_dict object so we can play the song
    song_dict[id] = recNotes;

    var name = document.getElementById("recordName").value; // adds it to the tunedrop
    addTuneDropOption(name, id);

    document.getElementById("recordbtn").disabled = false; // switches the button status
    document.getElementById("stopbtn").disabled = true;

    var data = {'name': name, 'tune': song_dict[id]}; // data that is sent to the backend
    postBackend(data);
}

// 6. Save recorded tunes on the backend.
function postBackend(data) {
    var url = "https://veff2022-h1.herokuapp.com/api/v1/tunes";

    axios.post(url, data)
    .then(function (response) {
        console.log('Success: ', response.data);
      })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
    });
}
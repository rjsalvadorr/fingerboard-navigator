/*
    Controls and encapsulates fingerboard logic, 
*/
var FingerboardController = {
    BASE_PITCH_LETTERS: [
        {name: "A", flatName: "", sharpName: ""},
        {name: "", flatName: "B♭", sharpName: "A♯"},
        {name: "B", flatName: "", sharpName: ""},
        {name: "C", flatName: "", sharpName: ""},
        {name: "", flatName: "D♭", sharpName: "C♯"},
        {name: "D", flatName: "", sharpName: ""},
        {name: "", flatName: "E♭", sharpName: "D♯"},
        {name: "E", flatName: "", sharpName: ""},
        {name: "F", flatName: "", sharpName: ""},
        {name: "", flatName: "G♭", sharpName: "F♯"},
        {name: "G", flatName: "", sharpName: ""},
        {name: "", flatName: "A♭", sharpName: "G♯"}
    ],
    MIDI_PITCHES: [],
    MIDI_CODE_START: 21,
    MIDI_CODE_END: 108,
    noteArray: "",
    numStrings: 0,
    numNotePositions: 0,
    initialize: function() {
        console.log("FingerboardController.initialize() started...");
        
        var currentOctave = 0;
        var currentBasePitch = 0;
        
        // We're using MIDI pitch codes to identify pitches.
        // All the way from A0 to C8
        for(var midiIndex = 21; midiIndex <= this.MIDI_CODE_END; midiIndex++) {
            for(var basePitchIndex = 0; basePitchIndex < this.BASE_PITCH_LETTERS.length; basePitchIndex++) {
                currentBasePitch = this.BASE_PITCH_LETTERS[basePitchIndex];
                if(currentBasePitch.name === "C") {
                    currentOctave++;
                }
                var newPitch = {
                    code: midiIndex,
                    name: currentBasePitch.name,
                    accidental: currentBasePitch.name === "" ? true : false,
                    flatName: currentBasePitch.flatName,
                    sharpName: currentBasePitch.sharpName,
                    octave: currentOctave
                };
                this.MIDI_PITCHES.push(newPitch);
                if(basePitchIndex !== this.BASE_PITCH_LETTERS.length - 1) {
                    midiIndex++;
                }
            }
        }
        console.log("FingerboardController.initialize() done!");
    },
    
    createArray: function(length) {
        // graciously "donated" from http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
        }

        return arr;
    },
    
    getPitchFromMidiCode: function(midiCode) {
        for(var i = 0; i < this.MIDI_PITCHES.length; i++) {
            if(this.MIDI_PITCHES[i].code === midiCode) {
                return this.MIDI_PITCHES[i];
            }
        }
    },
    
    registerNote: function(stringNum, notePosNum, pitchCode, isMarked) {
        console.log("FingerboardController.registerNote() started...");
        this.noteArray[stringNum][notePosNum] = {
            pitch: this.getPitchFromMidiCode(pitchCode),
            marked: isMarked
        };
        if(stringNum > this.numStrings) {
            this.numStrings = stringNum;
        }
        if(notePosNum > this.numNotePositions) {
            this.numNotePositions = notePosNum;
        }
        console.log("FingerboardController.registerNote() done!");
    },
    toggleNote: function(stringNum, notePosNum) {
        
    },
    unmarkNote: function(stringNum, notePosNum) {
        for(i = 0; i < this.noteArray.length; i++) {
            
        }
    },
    unmarkNotesOnString: function(stringNum) {
        // find all notes on this string
        var notesOnString = this.getNotesOnString(stringNum);
        
        // unmark!
        for(var i = 0; i < this.noteArray.length; i++) {
            notesOnString[i].marked = false;
        }
    },
    getNotesOnString: function(stringNum) {
        return this.noteArray[stringNum];
    },
    initializeStringPitches: function(pitchCodeArray, numNotePositions) {
        this.noteArray = this.createArray(pitchCodeArray.length + 1, numNotePositions);
        
        console.log("FingerboardController.initializeStringPitches() started...");
        console.info(pitchCodeArray);
        for(var i = 0; i < pitchCodeArray.length; i++) {
            var stringNum = i + 1;
            var initPitch = pitchCodeArray[i];
            var currentPitch = initPitch;
            
            for(var notePos = 0; notePos <= numNotePositions; notePos++) {
                this.registerNote(stringNum, notePos, currentPitch, false);
                currentPitch++;
            }
        }
        console.log("FingerboardController.initializeStringPitches() done!");
    }
    
};
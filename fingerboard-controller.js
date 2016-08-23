/*
    Controls and encapsulates fingerboard logic.
*/
var FingerboardController = {
    constants: {
        SCALE_CHORD_TYPES: [
            // Interval numbers = steps upwards.
            {tSymbol: "minor", quality: "MINOR", type: "SCALE", name: "Minor scale", id: 11, intervals: [2, 1, 2, 2, 1, 2]},
            {tSymbol: "major", quality: "MAJOR", type: "SCALE", name: "Major scale", id: 12, intervals: [2, 2, 1, 2, 2, 2]},

            {tSymbol: "M", quality: "MAJOR", type: "CHORD", name: "Major triad", id: 21, intervals: [4, 3]},
            {tSymbol: "m", quality: "MINOR", type: "CHORD", name: "Minor triad", id: 22, intervals: [3, 4]},
            {tSymbol: "dim", quality: "DIMINISHED", type: "CHORD", name: "Diminished triad", id: 23, intervals: [3, 3]},
            {tSymbol: "aug", quality: "AUGMENTED", type: "CHORD", name: "Augmented triad", id: 24, intervals: [4, 4]},

            {tSymbol: "7b5", quality: "DIMINISHED", type: "CHORD", name: "Half-diminished 7th", id: 33, intervals: [3, 3, 4]},
            {tSymbol: "dim7", quality: "DIMINISHED", type: "CHORD", name: "Diminished 7th", id: 34, intervals: [3, 3, 3]},
            
            {tSymbol: "maj7", quality: "MAJOR", type: "CHORD", name: "Major 7th", id: 31, intervals: [4, 3, 4]},
            {tSymbol: "min7", quality: "MINOR", type: "CHORD", name: "Minor 7th", id: 32, intervals: [3, 4, 3]}
        ]
    },
    BASE_PITCH_LETTERS: [
        {name: "A", flatName: "", sharpName: ""},
        {name: "", flatName: "Bb", sharpName: "A#"},
        {name: "B", flatName: "", sharpName: ""},
        {name: "C", flatName: "", sharpName: ""},
        {name: "", flatName: "Db", sharpName: "C#"},
        {name: "D", flatName: "", sharpName: ""},
        {name: "", flatName: "Eb", sharpName: "D#"},
        {name: "E", flatName: "", sharpName: ""},
        {name: "F", flatName: "", sharpName: ""},
        {name: "", flatName: "Gb", sharpName: "F#"},
        {name: "G", flatName: "", sharpName: ""},
        {name: "", flatName: "Ab", sharpName: "G#"}
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
        for(var midiIndex = this.MIDI_CODE_START; midiIndex <= this.MIDI_CODE_END; midiIndex++) {
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
    },
    
    /**************************************************************************
    *   SCALE/CHORD CALCULATIONS   ********************************************
    **************************************************************************/
    
    getScaleChordPitches: function(scaleChordSymbol, startingPitchId) {
        for(var i = 0; i < FingerboardController.constants.SCALE_CHORD_TYPES.length; i++) {
            var scaleChord = FingerboardController.constants.SCALE_CHORD_TYPES[i];
            
            console.log("interval stuff: " + scaleChord.name);
            if(scaleChord.tSymbol === scaleChordSymbol) {
                // Intervals match!
                var scaleChordPitches = [];
                scaleChordPitches.push(this.getPitchFromMidiCode(startingPitchId));

                var currentPitchId = startingPitchId;
                
                // Using the starting pitch Id, get all the pitches for the scale/chord
                // Add those intervals to the startingId to arrive at the correct IDs for the whole scale/chord
                for(var j = 0; j < scaleChord.intervals.length; j++) {
                    currentPitchId += scaleChord.intervals[j];
                    scaleChordPitches.push(this.getPitchFromMidiCode(currentPitchId));
                }
                
                return scaleChordPitches;
            }
        }
        
        return null;
    },
    
    getChordName: function(scaleChordId, startingPitchId) {
        var chordName = "";
        for(var i = 0; i < FingerboardController.constants.SCALE_CHORD_TYPES.length; i++) {
            var scaleChord = FingerboardController.constants.SCALE_CHORD_TYPES[i];
            if(scaleChord.id === scaleChordId) {
                // Intervals match!
                var scaleChordPitches = [];
                chordName += this.getPitchFromMidiCode(startingPitchId);

                var currentPitchId = startingPitchId;
                
                // Using the starting pitch Id, get all the pitches for the scale/chord
                // Add those intervals to the startingId to arrive at the correct IDs for the whole scale/chord
                for(var j = 0; j < scaleChord.intervals.length; j++) {
                    currentPitchId += scaleChord.intervals[j];
                    scaleChordPitches.push(this.getPitchFromMidiCode(currentPitchId));
                }
                
                return scaleChordPitches;
            }
        }
        
        return null;
    }
};
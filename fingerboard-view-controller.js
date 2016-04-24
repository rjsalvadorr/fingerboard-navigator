/*
    Controls DOM-related functions, and user-interaction functions.
    Will typically call methods of the FingerboardController.
*/
var FingerboardViewController = {
    constants: {
        TWELFTH_ROOT_OF_TWO: function() {
            return Math.pow(2, 1 / 12);
        },
        NUM_PITCHES: 12,
        DESIGN_CODES: ["minimalist", "guitar", "violin"]
    },
    initialize: function() {
        console.log("FingerboardViewController.initialize() started...");
        FingerboardController.initialize();
        console.log("FingerboardViewController.initialize() done!");
    },
    createFingerboardUnit: function(fbPositionNum) {
        console.log("creating fingerboard unit...");
        return jQuery("<div/>", {
            class: "fingerboard-unit",
            "data-position": fbPositionNum
        });
    },
    
    createFingerboardNoteUnit: function(stringNum, fbPositionNum) {
        console.log("creating fingerboard note unit...");
        var fbNoteUnit = jQuery("<div/>", {
            "class": "fingerboard-note-unit",
            "data-coordinates": stringNum + "," + fbPositionNum
        });
        jQuery("<div/>", {class: "note-unit-marker"}).appendTo(fbNoteUnit);
        jQuery("<div/>", {class: "note-unit-fret"}).appendTo(fbNoteUnit);
        jQuery("<div/>", {class: "note-unit-label"}).appendTo(fbNoteUnit);
        
        console.log("fingerboard note unit done!");
        return fbNoteUnit;
    },
    
    markNoteUnit: function(noteUnit) {
        // get note unit coords
        // call controller method to mark that position
        // if position is already marked, unmark it
    },
    
    createNut: function(numStrings) {
        console.log("creating nut...");
        var $nut = jQuery("<div/>", {
            class: "nut"
        });
        var $fbUnit = jQuery("<div/>", {
            class: "nut-unit",
            "data-position": 0
        })
        for(var stringNum = 1; stringNum <= numStrings; stringNum++) {
            var $fbNoteUnit = this.createFingerboardNoteUnit(stringNum, 0);
            $fbNoteUnit.appendTo($fbUnit);
        }
        $fbUnit.appendTo($nut);
        console.log("nut creation successful!");
        return $nut;
    },
    
    createFingerboard: function(numStrings, numNotePositions, isFretted) {
        console.log("creating fingerboard...");
        
        var classFretted = isFretted ? "fretted" : "fretless"
        
        var $fingerboard = jQuery("<div/>", {
            class: "fingerboard " + classFretted
        });
        // for each note position, create a note unit for each string.
        for(var notePos = 1; notePos <= numNotePositions; notePos++) {
            var $fbUnit = this.createFingerboardUnit(notePos);
            for(var stringNum = 1; stringNum <= numStrings; stringNum++) {
                var $fbNoteUnit = this.createFingerboardNoteUnit(stringNum, notePos);
                $fbNoteUnit.appendTo($fbUnit);
            }
            $fbUnit.appendTo($fingerboard);
        }
        
        console.log("fingerboard creation successful!");
        return $fingerboard;
    },
    
    createStrings: function(numStrings) {
        console.log("creating strings...");
        var $strings = jQuery("<div/>", {
            class: "strings"
        });
        for(var stringNum = 1; stringNum <= numStrings; stringNum++) {
            var $fbStringUnit = jQuery("<div/>", {
                class: "string-unit",
            })
            var $fbString = jQuery("<div/>", {
                class: "string",
            })
            $fbString.appendTo($fbStringUnit);
            $fbStringUnit.appendTo($strings);
        }
        console.log("string creation successful!");
        return $strings;
    },
    
    resizeFingerboard: function(numNotePositions) {
        var fbSectionPercentages = this.getFbSectionPercentages(numNotePositions);
        $(".fingerboard-unit").each(function() {
            this.style.width = fbSectionPercentages[this.dataset.position - 1] + "%";
        });
        console.log("FingerboardViewController.resizeFingerboard() done!");
    },
    
    writePitchData: function (stringNum, notePosNum, pitch) {
        var dataCoordString = stringNum + "," + notePosNum;
        var $fbNoteUnit = $(".fingerboard-note-unit[data-coordinates=\"" + dataCoordString + "\"]");
        var $fbNoteUnitLabel = $fbNoteUnit.children(".note-unit-label");
        $fbNoteUnitLabel.html(pitch.name);
        $fbNoteUnit[0].dataset.pitchCode = pitch.code;
        console.log("FingerboardViewController.writePitchData() " + pitch.code + ", " + pitch.name);
    },
    
    highlightPitch: function(pitchCode) {},
    highlightAllInstancesOfPitch: function(pitchCode, rgbColour) {
        console.log("FingerboardViewController.highlightAllInstancesOfPitch() started...");
        pitchCodesToHighlight = [];
        pitchCodesToHighlight.push(pitchCode);
        octaveCounter = 0;
        for(var indexUp = pitchCode + 1; indexUp <= FingerboardController.MIDI_CODE_END; indexUp++) {
            octaveCounter++;
            if(octaveCounter === FingerboardViewController.constants.NUM_PITCHES) {
                pitchCodesToHighlight.push(indexUp);
                octaveCounter = 0;
            }
        }
        
        octaveCounter = 0;
        for(var indexDown = pitchCode - 1; indexDown >= FingerboardController.MIDI_CODE_START; indexDown--) {
            octaveCounter++;
            if(octaveCounter === FingerboardViewController.constants.NUM_PITCHES) {
                pitchCodesToHighlight.push(indexDown);
                octaveCounter = 0;
            }
        }
        
        for(var i = 0; i < pitchCodesToHighlight.length; i++) {
            var $fbNoteUnit = $(".fingerboard-note-unit[data-pitch-code=\"" + pitchCodesToHighlight[i] + "\"] .note-unit-label");
            $fbNoteUnit.css("background-color", rgbColour);
        }
        console.log("FingerboardViewController.highlightAllInstancesOfPitch() done!");
    },
    
    changeFbDesign: function(designCode) {
        console.log("FingerboardViewController.changeFbDesign() started...");
        var $styleables = $(".nut, .fingerboard");
        for(var i = 0; i < FingerboardViewController.constants.DESIGN_CODES.length; i++) {
            if(FingerboardViewController.constants.DESIGN_CODES[i] === designCode) {
                $styleables.addClass(FingerboardViewController.constants.DESIGN_CODES[i]);
            } else {
                $styleables.removeClass(FingerboardViewController.constants.DESIGN_CODES[i]);
            }
        }
        
        console.log("FingerboardViewController.changeFbDesign() done!");
    },
    
    reloadPitches: function(initialPitches, numNotePositions) {
        console.log("FingerboardViewController.reloadPitches() started...");
        FingerboardController.initializeStringPitches(initialPitches, numNotePositions);
        var noteArray = FingerboardController.noteArray;
        if(noteArray.length == 0) {
            throw new FingerboardExceptions.ArrayEmptyException("FingerboardController's noteArray is empty!");
        }
        for(var stringIndex = 1; stringIndex < noteArray.length; stringIndex++) {
            var notePositionsInString = noteArray[stringIndex];
            for(var notePosIndex = 0; notePosIndex < notePositionsInString.length; notePosIndex++) {
                var currentNote = noteArray[stringIndex][notePosIndex].pitch;
                if(typeof(currentNote) !== "undefined" && currentNote !== null) {
                    this.writePitchData(stringIndex, notePosIndex, currentNote);
                }
            }
        }
        console.log("FingerboardViewController.reloadPitches() done!");
    },
    
    // MATHEMATICAL FUNCTIONS
    getFbSectionPercentages: function(numNotePositions) {
        var sectionPercentages = [];
        var previousVibratingLength = 100;
        var currentVibratingLength = 100;
        var diff = 0;
        var diffTotal = 0;
        var ratio = 0;
        
        for(var j = 1; j <= numNotePositions; j++) {
            currentVibratingLength = currentVibratingLength / FingerboardViewController.constants.TWELFTH_ROOT_OF_TWO();
            diff = previousVibratingLength - currentVibratingLength;
            //console.log("currentVibratingLength: " + currentVibratingLength)
            //console.log("previousVibratingLength: " + previousVibratingLength)
            //console.log("diff: " + diff)
            sectionPercentages.push(diff);
            diffTotal += diff;
            previousVibratingLength = currentVibratingLength;
        }
        
        //console.log("diffTotal: " + diffTotal)
        ratio = 100 / diffTotal;
        
        for(var k = 0; k < sectionPercentages.length; k++) {
            sectionPercentages[k] = sectionPercentages[k] * ratio;
            //console.log("sectionPercentages[k]: " + sectionPercentages[k]);
        }
        
        return sectionPercentages;
    }
};
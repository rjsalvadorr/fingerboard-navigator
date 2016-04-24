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
        DESIGN_CODES: ["minimalist", "guitar", "violin"],
        PITCH_CHOICES: [
            "Cb4",
            "C4",
            "C#4",
            "Db4",
            "D4",
            "D#4",
            "Eb4",
            "E4",
            "E#4",
            "Fb4",
            "F4",
            "F#4",
            "Gb4",
            "G4",
            "G#4",
            "Ab4",
            "A4",
            "A#4",
            "Bb4",
            "B4",
            "B#4",
        ]
    },
    usingSharpNames: true,
    initialize: function() {
        console.log("FingerboardViewController.initialize() started...");
        FingerboardController.initialize();
        console.log("FingerboardViewController.initialize() done!");
    },
    
    
    /**************************************************************************
    *   RENDERING FINGERBOARD   ***********************************************
    **************************************************************************/
    
    
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
        
        var pitchName = pitch.name;
        if(pitchName == "") {
            pitchName = pitch.sharpName;
        }
        var tNote = teoria.note(pitchName)
        pitchName = tNote.name().toUpperCase() + "<span class=\"chord-superscript\">" + tNote.accidental() + "</span>";
        
        $fbNoteUnitLabel.html(pitchName);
        $fbNoteUnit[0].dataset.pitchCode = pitch.code;
        console.log("FingerboardViewController.writePitchData() " + pitch.code + ", " + pitchName);
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
    
    createSelectFromList: function(selectId, selectName, selectClass, optionList) {
        var $selectElement = $( "<select/>", {
            id: selectId,
            name: selectName,
          "class": selectClass,
        });
        
        var currentOptionElement;
        
        for(var i = 0; i< optionList.length; i++) {
            currentOptionElement = $("<option/>", {
                text: optionList[i].option,
                value: optionList[i].value
            });
            
            if(optionList[i].extras != null && typeof(optionList[i].extras) != "undefined") {
                var optionExtrasArray = optionList[i].extras.split(";");
                
                for(var j = 0; j < optionExtrasArray.length; j++) {
                    var extraPair = optionExtrasArray[j].split(":");
                    var dataAttrName = "data-" + extraPair[0];
                    
                    currentOptionElement.attr(dataAttrName, extraPair[1]);
                }
            }
            
            $selectElement.append(currentOptionElement);
        }
        
        return $selectElement;
    },
    

    /**************************************************************************
    *   RENDERING CONTROLS   **************************************************
    **************************************************************************/
    renderControls: function() {
        var stringOptions = [];
        
        var noteOptions = [];
        
        var chordOptions = [];
        var scaleOptions = [];
        
        var currentScaleChordType = 0;
        var basePitchId = 69; // A440
        
        // initializing available notes
        for(var i = 0; i < this.constants.PITCH_CHOICES.length; i++) {
            var currentPitchName = this.constants.PITCH_CHOICES[i];
            
            var tNote = teoria.note(currentPitchName);
            var displayName = tNote.toString(true);
            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
            
            var newOptionValuePair = {option: displayName, value: tNote.toString(false)};
            
            noteOptions.push(newOptionValuePair);
        }
    
        // initializing available scale/chord types
        for(var i = 0; i < FingerboardController.constants.SCALE_CHORD_TYPES.length; i++) {
            currentScaleChordType = FingerboardController.constants.SCALE_CHORD_TYPES[i];
            var newOptionValuePair = {option: currentScaleChordType.name, value: currentScaleChordType.tSymbol, extras: "chord-scale-quality:" + currentScaleChordType.quality + ";"};
    
            if(currentScaleChordType.type === "SCALE") {
                newOptionValuePair.extras += "type:SCALE;"
                scaleOptions.push(newOptionValuePair);
            } else if(currentScaleChordType.type === "CHORD") {
                newOptionValuePair.extras += "type:CHORD;"
                chordOptions.push(newOptionValuePair);
            }
        }
    
        var pitchSelect = this.createSelectFromList("pitch-select", "pitch-select", "dynamic-select", noteOptions);
        var chordSelect = this.createSelectFromList("chord-select", "chord-select", "dynamic-select", chordOptions);
        var scaleSelect = this.createSelectFromList("scale-select", "scale-select", "dynamic-select", scaleOptions);
        
        var $controlElement = $( "<div/>", {
            id: "fingerboard-controls",
            name: "fingerboard-controls",
          "class": "generated-element",
        });
        
        $controlElement.append("<label class=\"fingerboard-control-label\">Pitch: </label>");
        $controlElement.append(pitchSelect);
        
        $controlElement.append("<label class=\"fingerboard-control-label\">Chord Select: </label>");
        $controlElement.append(chordSelect);
        $controlElement.append("<button type=\"button\" id=\"button-highlight-chord\" class=\"btn btn-primary fingerboard-control-button\">Highlight Chord</button>");
        
        $controlElement.append("<label class=\"fingerboard-control-button\">Scale Select: </label>");
        $controlElement.append(scaleSelect);
        $controlElement.append("<button type=\"button\" id=\"button-highlight-scale\" class=\"btn btn-primary fingerboard-control-button\">Highlight Scale</button>");
        
        return $controlElement;
    },
    
    
    /**************************************************************************
    *   HIGHLIGHTING   ********************************************************
    **************************************************************************/
    
    getAllInstancesOfPitch: function(pitchCode) {
        var pitchCodesToHighlight = [];
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
        
        return pitchCodesToHighlight;
    },
    
    highlightPitch: function(pitchCode) {},
    
    highlightAllInstancesOfPitch: function(pitchCode, rgbColour) {
        console.log("FingerboardViewController.highlightAllInstancesOfPitch() started...");
        var pitchCodesToHighlight = this.getAllInstancesOfPitch(pitchCode);
        
        for(var i = 0; i < pitchCodesToHighlight.length; i++) {
            var $fbNoteUnit = $(".fingerboard-note-unit[data-pitch-code=\"" + pitchCodesToHighlight[i] + "\"] .note-unit-label");
            $fbNoteUnit.css("background-color", rgbColour);
        }
        console.log("FingerboardViewController.highlightAllInstancesOfPitch() done!");
    },
    
    highlightScaleOrChord: function(type, scaleChord, startingPitch) {
        var tNote = teoria.note(startingPitch);
        var pitchesToHighlight = FingerboardController.getScaleChordPitches(scaleChord, tNote.midi());
        var colour;
        var tChordOrScale;
        
        this.hideAllLabels();
        
        if(type === "CHORD") {
            tChordOrScale = tNote.chord(scaleChord);
        } else if(type === "SCALE") {
            tChordOrScale = tNote.scale(scaleChord);
        }
        
        this.renamePitches(tChordOrScale);
        
        for(var i = 0; i < pitchesToHighlight.length; i++) {
            if(i == 0) {
                colour = "#ff6666"
                this.highlightAllInstancesOfPitch(pitchesToHighlight[i].code, colour);
            }
            
            this.showAllInstancesOfPitch(pitchesToHighlight[i].code);
        }
    },
    
    clearHighlighting: function() {
        var $fbNoteUnitLabels = $(".fingerboard-note-unit .note-unit-label");
        $fbNoteUnitLabels.css("display", "block");
        $fbNoteUnitLabels.css("background-color", "#ffffff");
    },
    
    hideAllLabels: function() {
        var $fbNoteUnitLabels = $(".fingerboard-note-unit .note-unit-label");
        $fbNoteUnitLabels.css("display", "none");
        $fbNoteUnitLabels.css("background-color", "#ffffff");
    },
    
    showAllInstancesOfPitch: function(pitchCode) {
        var pitchCodesToHighlight = this.getAllInstancesOfPitch(pitchCode);
        
        for(var i = 0; i < pitchCodesToHighlight.length; i++) {
            var $fbNoteUnit = $(".fingerboard-note-unit[data-pitch-code=\"" + pitchCodesToHighlight[i] + "\"] .note-unit-label");
            $fbNoteUnit.css("display", "block");
        }
    },
    renamePitches: function(tChordOrScale) {
        // for each pitch in the teoria scale, rename it to the right value
        var tNotes = tChordOrScale.notes();
        var noteName;
        var $fbNoteUnitLabel;
        
        for(var i = 0; i < tNotes.length; i++) {
            /*noteName = tNotes[i].toString(true);*/
            noteName = tNotes[i].name().toUpperCase() + "<span class=\"chord-superscript\">" + tNotes[i].accidental() + "</span>";
            var targetPitches = this.getAllInstancesOfPitch(tNotes[i].midi());
            
            for(var j = 0; j < targetPitches.length; j++) {
                $fbNoteUnitLabel = $(".fingerboard-note-unit[data-pitch-code=\"" + targetPitches[j] + "\"] .note-unit-label");
                $fbNoteUnitLabel.html(noteName);
            }
        }
    },
    
    
    /**************************************************************************
    *   FINGERBOARD VISUALS   *************************************************
    **************************************************************************/
    
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
    
    
    /**************************************************************************
    *   LOGIC FOR CONTROLS   **************************************************
    **************************************************************************/
    
    // next function - hide or show various pitch <option> based on currently selected chord/scale type.
    // 
    
    
    
    /**************************************************************************
    *   MATHEMATICAL FUNCTIONS   **********************************************
    **************************************************************************/
    
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
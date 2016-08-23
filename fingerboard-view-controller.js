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
        NUM_SEMITONES_IN_OCTAVE: 12,
        DESIGN_CODES: ["minimalist", "light", "dark"],
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
            "B#4"
        ],
        PRESETS: {
            // TODO: use teoria notes for the starting pitches!
            CELLO: {
                name: "Violoncello",
                numStrings: 4,
                numPositions: 20,
                fretted: false,
                startingPitches: [
                    // REMEMBER, STRING ENUMERATION STARTS FROM HIGHEST PITCH
                    57, // A3
                    50, // D3
                    43, // G2
                    36 // C2
                ]
            },
            VIOLA: {
                name: "Viola",
                numStrings: 4,
                numPositions: 20,
                fretted: false,
                startingPitches: [
                    69, // A4
                    62, // D4
                    55, // G3
                    48 // C3
                ]
            },
            GUITAR: {
                name: "Guitar (Standard tuning)",
                numStrings: 6,
                numPositions: 20,
                fretted: true,
                startingPitches: [
                    64, // E4
                    59, // B3
                    55, // G3
                    50, // D3
                    45, // A3
                    40 // E2
                ]
            },
            BASS_GUITAR: {
                name: "Bass Guitar (Standard tuning)",
                numStrings: 4,
                numPositions: 20,
                fretted: true,
                startingPitches: [
                    43, // G2
                    38, // D2
                    33, // A2
                    28 // E1
                ]
            },
            BASS_GUITAR_5_STR: {
                name: "Bass Guitar (5 strings, Standard tuning)",
                numStrings: 5,
                numPositions: 20,
                fretted: true,
                startingPitches: [
                    43, // G2
                    38, // D2
                    33, // A2
                    28, // E1
                    23 // B0
                ]
            },
            GUITAR_NST: {
                name: "Guitar (NST/Fifths tuning)",
                numStrings: 6,
                numPositions: 20,
                fretted: true,
                startingPitches: [
                    67, // G4
                    64, // E4
                    57, // A3
                    50, // D3
                    43, // G2
                    36 // C2
                ]
            },
            VIOLIN: {
                name: "Violin",
                numStrings: 4,
                numPositions: 19,
                fretted: false,
                startingPitches: [
                    76, // E5
                    69, // A4
                    62, // D4
                    55 // G3
                ]
            },
            UKULELE: {
                name: "Ukulele",
                numStrings: 4,
                numPositions: 15,
                fretted: true,
                startingPitches: [
                    69, // A4
                    64, // E4
                    60, // C4
                    67 // G4
                ]
            }
        },
        GUIDE_TYPES: [
            {cssClass: "dots", name: "Dots", value: "GUITAR_DOTS"},
            {cssClass: "numerals", name: "Numerals", value: "GUITAR_NUMERALS"},
            {cssClass: "harmonic-nodes", name: "Harmonic Nodes", value: "HARMONIC_NODES"}
        ],
        GUIDE_POSITIONS: [3, 5, 7, 9, 12, 15, 17, 19, 24]
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
    
    createNut: function(numStrings, isFretted) {
        console.log("creating nut...");
        
        var classFretted = isFretted ? "fretted" : "fretless"
        
        var $nut = jQuery("<div/>", {
            class: "nut " + classFretted
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
    
    createGuide: function(numNotePositions, isFretted) {
        console.log("creating guide...");
        
        var classFretted = isFretted ? "fretted" : "fretless"
        
        var $guide = jQuery("<div/>", {
            class: "guide " + classFretted
        });
        
        // for each note position, create a guide unit.
        for(var notePos = 1; notePos <= numNotePositions; notePos++) {
            var $guideUnit = this.createGuideUnit(notePos);
            
            $guideUnit.appendTo($guide);
        }
        
        console.log("guide creation successful!");
        return $guide;
    },
    
    createGuideUnit: function(fbPositionNum) {
        console.log("creating guide unit...");
        
        var $guideUnit = jQuery("<div/>", {
            class: "guide-unit",
            "data-position": fbPositionNum
        });
        
        
        if(FingerboardViewController.constants.GUIDE_POSITIONS.indexOf(fbPositionNum) > -1) {
            var markerClass = fbPositionNum % 12 == 0 ? "two-markers" : "one-marker";

            var $guideMarker = jQuery("<div/>", {
                class: "guide-marker " + markerClass
            });

            var $guideTextMarker = jQuery("<div/>", {
                class: "guide-text-marker",
                text: romanize(fbPositionNum)
            });
            
            var harmonicString;
            var hasHarmonicValue = true;
            switch(fbPositionNum) {
                case 12:
                    harmonicString = "2nd";
                    break;
                case 7:
                case 19:
                    harmonicString = "3rd";
                    break;
                case 5:
                case 24:
                    harmonicString = "4th";
                    break;
                default:
                    harmonicString = "";
                    hasHarmonicValue = false;
                    break;
            }
            
            $guideTextMarker.appendTo($guideUnit);
            $guideMarker.appendTo($guideUnit);
            
            if(hasHarmonicValue) {
                var $guideHarmonicMarker = jQuery("<div/>", {
                    class: "guide-harmonic-marker ",
                    text: harmonicString
                });
                $guideHarmonicMarker.appendTo($guideUnit);
            }
        }
        
        return $guideUnit;
    },
    
    resizeFingerboard: function(numNotePositions) {
        var fbSectionPercentages = this.getFbSectionPercentages(numNotePositions);
        $(".fingerboard-unit, .guide-unit").each(function() {
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
        
        var presetOptions = [];
        var noteOptions = [];
        
        var chordOptions = [];
        var scaleOptions = [];
        var guideOptions = [];
        
        var currentScaleChordType = 0;
        var basePitchId = 69; // A440
        
        
        // initializing available presets
        for(var key in this.constants.PRESETS) {
            // skip loop if the property is from prototype
            if (!this.constants.PRESETS.hasOwnProperty(key)) continue;

            var obj = this.constants.PRESETS[key];
            /*for (var prop in obj) {
                // skip loop if the property is from prototype
                if(!obj.hasOwnProperty(prop)) continue;

                // your code
                alert(prop + " = " + obj[prop]);
            }*/
            
            var newOptionValuePair = {option: obj["name"], value: key};
            presetOptions.push(newOptionValuePair);
        }
        
        // initializing available notes
        for(var i = 0; i < this.constants.PITCH_CHOICES.length; i++) {
            var currentPitchName = this.constants.PITCH_CHOICES[i];
            
            var tNote = teoria.note(currentPitchName);
            var displayName = tNote.toString(true);
            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
            
            var newOptionValuePair = {option: displayName, value: tNote.toString(false)};
            
            noteOptions.push(newOptionValuePair);
        }
        
        var currentScaleChordType;
    
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
        
        var currentMarkerType;
        
        // initializing guides
        for(var i = 0; i < FingerboardViewController.constants.GUIDE_TYPES.length; i++) {
            currentMarkerType = FingerboardViewController.constants.GUIDE_TYPES[i];
            var newOptionValuePair = {option: currentMarkerType.name, value: currentMarkerType.value, extras: ""};
            guideOptions.push(newOptionValuePair);
        }
    
        var presetSelect = this.createSelectFromList("preset-select", "preset-select", "dynamic-select", presetOptions);
        var pitchSelect = this.createSelectFromList("pitch-select", "pitch-select", "dynamic-select", noteOptions);
        
        var chordSelect = this.createSelectFromList("chord-select", "chord-select", "dynamic-select", chordOptions);
        var scaleSelect = this.createSelectFromList("scale-select", "scale-select", "dynamic-select", scaleOptions);
        var guideSelect = this.createSelectFromList("guide-select", "guide-select", "dynamic-select", guideOptions);
        
        var $controlElement = $( "<div/>", {
            id: "fingerboard-controls",
            name: "fingerboard-controls",
          "class": "generated-element",
        });
        
        $controlElement.append("<label class=\"fingerboard-control-label\">Presets: </label>");
        $controlElement.append(presetSelect);
        $controlElement.append("<button type=\"button\" id=\"button-change-preset\" class=\"btn btn-primary fingerboard-control-button\">Change Preset</button>");
        $controlElement.append("<br>");
        
        $controlElement.append("<label class=\"fingerboard-control-label\">Pitch: </label>");
        $controlElement.append(pitchSelect);
        $controlElement.append("<br>");
        
        $controlElement.append("<label class=\"fingerboard-control-label\">Chord Select: </label>");
        $controlElement.append(chordSelect);
        $controlElement.append("<br>");
        
        $controlElement.append("<label class=\"fingerboard-control-label\">Scale Select: </label>");
        $controlElement.append(scaleSelect);
        $controlElement.append("<br>");
        
        $controlElement.append("<label class=\"fingerboard-control-label\">Guide Style: </label>");
        $controlElement.append(guideSelect);
        $controlElement.append("<br>");
        
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
    
    highlightAllInstancesOfPitch: function(pitchCode, highlightClass) {
        console.log("FingerboardViewController.highlightAllInstancesOfPitch() started...");
        var pitchCodesToHighlight = this.getAllInstancesOfPitch(pitchCode);
        
        for(var i = 0; i < pitchCodesToHighlight.length; i++) {
            var $fbNoteUnit = $(".fingerboard-note-unit[data-pitch-code=\"" + pitchCodesToHighlight[i] + "\"] .note-unit-label");
            $fbNoteUnit.addClass(highlightClass);
        }
        console.log("FingerboardViewController.highlightAllInstancesOfPitch() done!");
    },
    
    highlightScaleOrChord: function(type, scaleChord, startingPitch) {
        var tNote = teoria.note(startingPitch);
        var pitchesToHighlight = FingerboardController.getScaleChordPitches(scaleChord, tNote.midi());
        var colour;
        var tChordOrScale;
        var currentMidiCode
        
        this.hideAllLabels();
        
        if(type === "CHORD") {
            tChordOrScale = tNote.chord(scaleChord);
        } else if(type === "SCALE") {
            tChordOrScale = tNote.scale(scaleChord);
        }
        
        this.renamePitches(tChordOrScale);
        
        for(var i = 0; i < pitchesToHighlight.length; i++) {
            currentMidiCode = pitchesToHighlight[i].code;
            
            if(currentMidiCode == tChordOrScale.get("first").midi()) {
                highlightClass = "highlight-root"
            } else if(currentMidiCode == tChordOrScale.get("third").midi()) {
                highlightClass = "highlight-third";
            } else if(currentMidiCode == tChordOrScale.get("fifth").midi()) {
                highlightClass = "highlight-fifth";
            } else if(currentMidiCode == tChordOrScale.get("seventh").midi()) {
                highlightClass = "highlight-seventh";
            } else {
                highlightClass = "";
            }
            
            this.highlightAllInstancesOfPitch(currentMidiCode, highlightClass);
            
            this.showAllInstancesOfPitch(currentMidiCode);
        }
    },
    
    clearHighlighting: function() {
        var $fbNoteUnitLabels = $(".fingerboard-note-unit .note-unit-label");
        $fbNoteUnitLabels.css("display", "block");
        $fbNoteUnitLabels.removeClass("highlight-root highlight-third highlight-fifth highlight-seventh");
    },
    
    hideAllLabels: function() {
        var $fbNoteUnitLabels = $(".fingerboard-note-unit .note-unit-label");
        $fbNoteUnitLabels.css("display", "none");
        $fbNoteUnitLabels.removeClass("highlight-root highlight-third highlight-fifth highlight-seventh");
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
        var $styleables = $(".nut, .fingerboard, .strings, .guide");
        
        // No argument? Set design code to an empty string. It'll remove the classes later
        if(designCode === null || typeof(designCode) === "undefined") {
            designCode = "";
        }
        
        for(var i = 0; i < FingerboardViewController.constants.DESIGN_CODES.length; i++) {
            if(FingerboardViewController.constants.DESIGN_CODES[i] === designCode) {
                $styleables.addClass(FingerboardViewController.constants.DESIGN_CODES[i]);
            } else {
                $styleables.removeClass(FingerboardViewController.constants.DESIGN_CODES[i]);
            }
        }
        
        console.log("FingerboardViewController.changeFbDesign() done!");
    },
    
    changeGuideStyle: function(style) {
        var $guideElement = $(".guide");
        
        for(var i = 0; i < FingerboardViewController.constants.GUIDE_TYPES.length; i++) {
            currentMarkerType = FingerboardViewController.constants.GUIDE_TYPES[i];
            if(currentMarkerType.value === style){
                $guideElement.addClass(currentMarkerType.cssClass);
            } else {
                $guideElement.removeClass(currentMarkerType.cssClass);
            }
        }
    },
    
    
    /**************************************************************************
    *   LOGIC FOR CONTROLS   **************************************************
    **************************************************************************/
    reloadUi: function(uiSettingsObj) {
        /* uiSettingsObj has:
            - preset
            - pitch
            - scaleOrChordType
            - scaleOrChordSymbol
            - isMinimalist
            - guideStyle
        */
        
        if(uiSettingsObj.isMinimalist) {
            changeFbDesign("minimalist");
        } else {
            changeFbDesign();
        }
        
        this.changeGuideStyle(uiSettingsObj.guideStyle);
        this.highlightScaleOrChord(uiSettingsObj.scaleOrChordType, uiSettingsObj.scaleOrChordSymbol, uiSettingsObj.pitch);
    },
    
    
    
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
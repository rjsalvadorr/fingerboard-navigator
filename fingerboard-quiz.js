/*
    Controls the UI directly. Will typically call methods of FingerboardViewController to make things happen.
    Holds values related to the display.
*/

var FingerboardQuiz = {
    numStrings: 0,
    numNotePositions: 0,
    fretted: 0,
    initialStringPitches: 0,
    instrumentName: 0,
    
    $fingerboardInfoContainer: 0,
    $fingerboardContainer: 0,
    $fingerboardControlsContainer: 0,
    
    accidentalMode: 0,
    
    initialize: function(presetObj) {
        this.numStrings = presetObj.numStrings;
        this.numNotePositions = presetObj.numPositions;
        this.fretted = presetObj.fretted;
        this.initialStringPitches = presetObj.startingPitches;
        this.instrumentName = presetObj.name;
        
        try {
            FingerboardViewController.initialize();
        } catch(e) {
            console.log("EXCEPTION CAUGHT IN FingerboardQuiz.initialize():\n" + e.name + " - " + e.message);
        }
    },
    renderFingerboard: function(targetSelector) {
        try {
            // create fingerboard HTML
            this.$fingerboardContainer = $(targetSelector);
            
            var $nut = FingerboardViewController.createNut(this.numStrings, this.fretted);
            $nut.appendTo(this.$fingerboardContainer);

            var $fingerboard = FingerboardViewController.createFingerboard(this.numStrings, this.numNotePositions, this.fretted);
            $fingerboard.appendTo(this.$fingerboardContainer);

            var $strings = FingerboardViewController.createStrings(this.numStrings);
            $strings.appendTo(this.$fingerboardContainer);
            
            var $guide = FingerboardViewController.createGuide(this.numNotePositions, this.fretted);
            $guide.appendTo(this.$fingerboardContainer);

            // set the fb unit lenghts
            FingerboardViewController.resizeFingerboard(this.numNotePositions);

            // initialize note position pitches (yes, my terminology really sucks here...)
            FingerboardViewController.reloadPitches(this.initialStringPitches, this.numNotePositions);
        } catch(e) {
            console.log("EXCEPTION CAUGHT IN FingerboardQuiz.renderFingerboard():\n" + e.name + " - " + e.message);
        }
    },
    renderError: function(errorMessage) {
        
    },
    renderInfo: function(targetSelector) {
        this.$fingerboardInfoContainer = $(targetSelector);
        
        var instrumentNameString = "<p class=\"generated-text\"><h1 id=\"title-current-instrument\">Current Instrument: </h1><span id=\"text-current-instrument\">" + this.instrumentName + "</span></p>";
        this.$fingerboardInfoContainer.append(instrumentNameString);
    },
    renderControls: function(targetSelector) {
        this.$fingerboardControlsContainer = $(targetSelector);
        var $controls = FingerboardViewController.renderControls();
        $controls.appendTo(this.$fingerboardControlsContainer);
    },
    clearQuiz: function() {
        this.$fingerboardInfoContainer.empty();
        this.$fingerboardContainer.empty();
    }
};

$(document).ready(function() {
    // Note positions include the nut!!!
    FingerboardQuiz.initialize(FingerboardViewController.constants.PRESETS.GUITAR);
    FingerboardQuiz.renderFingerboard("#fretboard-container");
    FingerboardQuiz.renderControls("#fretboard-controls-container");
    FingerboardQuiz.renderInfo("#fretboard-info-container");
    
    // TESTING!!!
    FingerboardViewController.getFbSectionPercentages(12);
    
    $("#chk-design-minimalist").change(function() {
        if(this.checked) {
            FingerboardViewController.changeFbDesign("minimalist");    
        } else {
            FingerboardViewController.changeFbDesign();  
        }
    });
    
    $("#button-highlight-open-strings").click(function() {
        //TODO:
        // -create new function in 
        /*FingerboardViewController.highlightAllInstancesOfPitch(57, "#bbbbff");
        FingerboardViewController.highlightAllInstancesOfPitch(50, "#ffbbbb");
        FingerboardViewController.highlightAllInstancesOfPitch(43, "#bbffbb");
        FingerboardViewController.highlightAllInstancesOfPitch(36, "#ffffbb");*/
    });
    
    $("#button-highlight-perfect-intervals").click(function() {
        
    });
    
    $("#chord-select").change(function() {
        var chordSymbol = $("#chord-select").val();
        var startingPitch = $("#pitch-select").val();
        
        var e = document.getElementById("pitch-select");
        
        var chordSelect = document.getElementById("chord-select");
        var type = chordSelect.options[chordSelect.selectedIndex].dataset.type;
        
        FingerboardViewController.highlightScaleOrChord(type, chordSymbol, startingPitch);
    });
    
    $("#scale-select").change(function() {
        var scaleSymbol = $("#scale-select").val();
        var startingPitch = $("#pitch-select").val();
        
        var scaleSelect = document.getElementById("scale-select");
        var type = scaleSelect.options[scaleSelect.selectedIndex].dataset.type;
        
        FingerboardViewController.highlightScaleOrChord(type, scaleSymbol, startingPitch);
    });
    
    $("#guide-select").change(function() {
        var selectedStyle = $(this).val();
        FingerboardViewController.changeGuideStyle(selectedStyle);
    });
    
    
    $("#button-change-preset").click(function() {
        var selectedPreset = $("#preset-select").val();
        
        FingerboardQuiz.clearQuiz();
        
        FingerboardQuiz.initialize(FingerboardViewController.constants.PRESETS[selectedPreset]);
        FingerboardQuiz.renderFingerboard("#fretboard-container");
        FingerboardQuiz.renderInfo("#fretboard-info-container");
    });
});
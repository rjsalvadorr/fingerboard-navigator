var FingerboardQuiz = {
    PRESET_CELLO: [
            // REMEMBER, STRING ENUMERATION STARTS FROM HIGHEST PITCH
            57, // A3
            50, // D3
            43, // G2
            36 // C2
    ],
    numStrings: 0,
    numNotePositions: 0,
    $fingerboardContainer: 0,
    fretted: 0,
    accidentalMode: 0,
    initialStringPitches: 0,
    initialize: function(numStr, numNotePos, isFretted, initStringPitches) {
        this.numStrings = numStr;
        this.numNotePositions = numNotePos;
        this.fretted = isFretted;
        this.initialStringPitches = initStringPitches;
        
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

            var $nut = FingerboardViewController.createNut(this.numStrings);
            $nut.appendTo(this.$fingerboardContainer);

            var $fingerboard = FingerboardViewController.createFingerboard(this.numStrings, this.numNotePositions, this.fretted);
            $fingerboard.appendTo(this.$fingerboardContainer);

            var $strings = FingerboardViewController.createStrings(this.numStrings);
            $strings.appendTo(this.$fingerboardContainer);

            // set the fb unit lenghts
            FingerboardViewController.resizeFingerboard(this.numNotePositions);

            // initialize note position pitches (yes, my terminology really sucks here...)
            FingerboardViewController.reloadPitches(this.initialStringPitches, this.numNotePositions);
        } catch(e) {
            console.log("EXCEPTION CAUGHT IN FingerboardQuiz.renderFingerboard():\n" + e.name + " - " + e.message);
        }
    },
    renderError: function(errorMessage) {
    
    }
};

$(document).ready(function() {
    // Note positions include the nut!!!
    FingerboardQuiz.initialize(4, 22, false, FingerboardQuiz.PRESET_CELLO);
    FingerboardQuiz.renderFingerboard("#fretboard-container");
    
    // TESTING!!!
    FingerboardViewController.getFbSectionPercentages(12);
        
    //
    $("#button-design-minimalist").click(function() {
        FingerboardViewController.changeFbDesign("minimalist");    
    });
    $("#button-highlight-open-strings").click(function() {
        //TODO:
        // -create new function in 
        FingerboardViewController.highlightAllInstancesOfPitch(57, "#bbbbff");
        FingerboardViewController.highlightAllInstancesOfPitch(50, "#ffbbbb");
        FingerboardViewController.highlightAllInstancesOfPitch(43, "#bbffbb");
        FingerboardViewController.highlightAllInstancesOfPitch(36, "#ffffbb");
    });
    $("#button-highlight-perfect-intervals").click(function() {
        
    });
});
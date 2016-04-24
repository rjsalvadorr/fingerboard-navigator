/******************************************************************************
*
* TODO: fix the math and messages in evaluateQuiz()
*
******************************************************************************/

var FretboardQuizzer = {
    Elements: {
        fretboardContainerJqObj: 0,
        fretboardJqObj: 0,
        fretboardAnnotationsJqObj: 0,
        noteImageJqObj: 0,
        nutJqObj: 0,
        clearButtonJqObj: 0,
        resetButtonJqObj: 0,
        submitButtonJqObj: 0,
        menuJqObj: 0,
        textContainerJqObj: 0,
        textOutputJqObj: 0,
        scoreOutputJqObj: 0,
        fretJqObj: 0
    },
    
    Constants: {
        NUM_FRETS: 12,
        NUM_STRINGS: 4,
        TREBLE: "treble",
        BASS: "bass",
        POSITION_DISPLAY: [3, 5, 7, 9, 12],
        NOTES: [
            {name: "E2", locations: ["6,0"]},
            {name: "F2", locations: ["6,1"]},
            {name: "G2", locations: ["6,3"]},
            {name: "A2", locations: ["6,5","5,0"]},
            {name: "B2", locations: ["6,7","5,2"]},
            {name: "C3", locations: ["6,8","5,3"]},
            {name: "D3", locations: ["6,10","5,5","4,0"]},
            {name: "E3", locations: ["6,12","5,7","4,2"]},
            {name: "F3", locations: ["5,8","4,3"]},
            {name: "G3", locations: ["5,10","4,5","3,0"]},
            {name: "A3", locations: ["5,12","4,7","3,2"]},
            {name: "B3", locations: ["4,9","3,4","2,0"]},
            {name: "C4", locations: ["4,10","3,5","2,1"]},
            {name: "D4", locations: ["4,12","3,7","2,3"]},
            {name: "E4", locations: ["3,9","2,5","1,0"]},
            {name: "F4", locations: ["3,10","2,6","1,1"]},
            {name: "G4", locations: ["3,12","2,8","1,3"]},
            {name: "A4", locations: ["2,10","1,5"]},
            {name: "B4", locations: ["2,12","1,7"]},
            {name: "C5", locations: ["1,8"]},
            {name: "D5", locations: ["1,10"]},
            {name: "E5", locations: ["1,12"]}
        ],
        DEFAULT_WIDTH: 600,
        INITIAL_WIDTH: 700,
        REPLACEMENT_STR: '%PLACEHOLDER%',
        DELIM_STR: '&'
    },
    
    Flags: {
        fretboardAtFullLength: false
    },
    
    Text: {
        ALL_ERROR: '<span id=\'fretboard-text-message\' style=\'color: red;\'>All wrong!!</span>',
        N_MARKERS: '<span id=\'fretboard-text-message\' style=\'color: yellow;\'>You\'re missing %PLACEHOLDER% marker(s)</span>',
        ALL_CORRECT: '<span id=\'fretboard-text-message\' style=\'color: green;\'>Nice! You got \'em all right!</span>'
    },
    
    markedStrings: [],
    currentQuizNote: 0,
    score: 0,

    ///////////////////////////////////////////////////////////////////////////
    /////   MATHEMATICS & NUMBER CRUNCHIN'   //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    twelfthRootOfTwo: function() {
        return Math.pow(2, 1 / 12);
    },

    getSectionLengthMultipliers: function(fretNumber) {
        var sectionLengths = [];
        var previousVibratingLength = 1;
        var currentVibratingLength = 1;
        var diff = 0;
        for(var j = 1; j <= fretNumber; j++) {
            currentVibratingLength = currentVibratingLength / this.twelfthRootOfTwo();
            diff = previousVibratingLength - currentVibratingLength;
            sectionLengths.push(diff);
            previousVibratingLength = currentVibratingLength;
        }
        return sectionLengths;
    },

    getSectionLengths: function(displayLength, fretNumber) {
        var sectionLengthMultipliers = this.getSectionLengthMultipliers(fretNumber);
        var sectionLengths = [];
        var sumMultipliers = 0;

        for(var i = 0; i < sectionLengthMultipliers.length; i++) {
            sumMultipliers += sectionLengthMultipliers[i];
        }

        var factor = displayLength / sumMultipliers;
        var sectionLength = 0;
        var sumLengths = 0;
        for(var i = 0; i < sectionLengthMultipliers.length; i++) {
            sectionLength = sectionLengthMultipliers[i] * factor;
            sectionLengths.push(sectionLength);
            sumLengths += sectionLength;
        }
        return sectionLengths;
    },

    bootlegRemToPx: function(remValue) {
        return remValue * 15;
    },

    ///////////////////////////////////////////////////////////////////////////
    /////   HTML GENERATION   /////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    getStringUnit: function() {
        var stringClass = "string-bass";
        return '<div class=\"string-unit\"><div class=\"' + stringClass + '\"></div></div>';
    },

    getFretUnit: function(fretNumber, stringNumber) {
        var stringCoordinates = stringNumber + ',' + fretNumber;
        var stringClass = "string-bass";
        return '<div class=\"fret-unit\"><div class="finger-position-unit" data-coordinates=\"' + stringCoordinates + '\"></div><div class=\"' + stringClass + '\"></div></div>';
    },

    getNut: function() {
        var fretNumber = 0;
        var nutHtml = '<div id=\"fretboard-nut\" class=\"nut\">';
        for(var stringNum = 1; stringNum <= this.Constants.NUM_STRINGS; stringNum++) {
            nutHtml += this.getStringUnit();
        }
        nutHtml += '</div>';
        return nutHtml;
    },

    getFret: function(fretNumber) {
        var fretHtml = '<div class=\"fret\">';
        for(var stringNum = 1; stringNum <= this.Constants.NUM_STRINGS; stringNum++) {
            fretHtml += this.getFretUnit(fretNumber, stringNum);
        }
        fretHtml += '</div>';
        return fretHtml;
    },

    getFretboardUnit: function(fretNumber, lengthPx) {
        var fretboardUnitHtml = '<div class=\"fretboard-unit\" style=\"width: ' + lengthPx + 'px\">';
        for(var stringNum = 1; stringNum <= this.Constants.NUM_STRINGS; stringNum++) {
            fretboardUnitHtml += this.getStringUnit();
        }
        fretboardUnitHtml += '</div>';
        return fretboardUnitHtml;
    },

    getAnnotation: function(fretNumber, lengthPx) {
        var fretPositionString = 0;
        if($.inArray(fretNumber, this.Constants.POSITION_DISPLAY) != -1) {
            fretPositionString = romanize(fretNumber);
        } else {
            fretPositionString = "";
        }
        return '<div class=\"space-fretboard-unit\" style=\"width: ' + lengthPx + 'px\">' + fretPositionString + '</div><div class=\"space-fret\"></div>';
    },

    ///////////////////////////////////////////////////////////////////////////
    /////   MAIN FRETBOARD GENERATOR FUNCTION   ///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    generateFretboard: function(fretboardContainerJqObj, numFrets) {
        var fretboardUnitHtml = 0;
        var fretUnitHtml = 0;
        var fretLength = 0;
        
        this.Elements.fretboardContainerJqObj = fretboardContainerJqObj;

        var displayLengths = this.getSectionLengths(this.Constants.INITIAL_WIDTH, numFrets);
        
        var fretboardMenuDiv = document.createElement('div');
        fretboardMenuDiv.className = 'row';
        fretboardMenuDiv.id = 'fretboard-menu';
        
        var fretboardMenuText = document.createElement('div');
        fretboardMenuText.className = 'col-xs-3';
        fretboardMenuText.id = 'fretboard-menu-text';
        fretboardMenuText.innerHTML  = 'Find this note: ';
        
        var noteImageContainer = document.createElement('div');
        noteImageContainer.className = 'col-xs-3';
        noteImageContainer.id = 'note-img-container';
        
        var noteImage = document.createElement('img');
        noteImage.className = 'img-responsive';
        noteImage.id = 'guitar-note-img';
        
        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'col-xs-6';
        buttonContainer.id = 'menu-button-container';
        
        var buttonClear = document.createElement('button');
        buttonClear.className = 'fretboard-quiz-button';
        buttonClear.id = 'fretboard-clear';
        buttonClear.innerHTML  = 'CLEAR MARKERS';
        
        var buttonReset = document.createElement('button');
        buttonReset.className = 'fretboard-quiz-button';
        buttonReset.id = 'fretboard-reset';
        buttonReset.innerHTML  = 'RESET';
        
        var buttonAnswer = document.createElement('button');
        buttonAnswer.className = 'fretboard-quiz-button';
        buttonAnswer.id = 'fretboard-answer';
        buttonAnswer.innerHTML  = 'SUBMIT';
        
        var textOutputContainer = document.createElement('div');
        textOutputContainer.className = 'row';
        textOutputContainer.id = 'fretboard-text-container';
        textOutputContainer.innerHTML  = 'SCORE: ';
        
        var scoreText = document.createElement('span');
        scoreText.id = 'fretboard-score';
        
        var textOutput = document.createElement('span');
        textOutput.id = 'fretboard-text-output';
        
        var fretboardGenerated = document.createElement('div');
        fretboardGenerated.className = 'fretboard row';
        fretboardGenerated.id = 'fretboard-generated';
        
        var annotationsGenerated = document.createElement('div');
        annotationsGenerated.className = 'annotations row';
        annotationsGenerated.id = 'annotations-generated';
        
        fretboardMenuDiv.appendChild(fretboardMenuText);
        fretboardMenuDiv.appendChild(noteImageContainer);
        noteImageContainer.appendChild(noteImage);
        fretboardMenuDiv.appendChild(buttonContainer);
        buttonContainer.appendChild(buttonClear);
        buttonContainer.appendChild(buttonReset);
        buttonContainer.appendChild(buttonAnswer);
        textOutputContainer.appendChild(scoreText);
        textOutputContainer.appendChild(textOutput);
        
        this.Elements.fretboardContainerJqObj.append(textOutputContainer);
        this.Elements.fretboardContainerJqObj.append(fretboardMenuDiv);
        this.Elements.fretboardContainerJqObj.append(fretboardGenerated);
        this.Elements.fretboardContainerJqObj.append(annotationsGenerated);
        
        this.Elements.fretboardJqObj = $('#fretboard-generated');
        this.Elements.fretboardAnnotationsJqObj = $('#annotations-generated');
        this.Elements.noteImageJqObj = $('#guitar-note-img');
        this.Elements.clearButtonJqObj = $('#fretboard-clear');
        this.Elements.resetButtonJqObj = $('#fretboard-reset');
        this.Elements.submitButtonJqObj = $('#fretboard-answer');
        this.Elements.menuJqObj = $('#fretboard-menu');
        this.Elements.textContainerJqObj = $('#fretboard-text-container');
        this.Elements.textOutputJqObj = $('#fretboard-text-output');
        this.Elements.scoreOutputJqObj = $('#fretboard-score');
        
        this.Elements.fretboardJqObj.append(this.getNut());
        this.Elements.fretboardAnnotationsJqObj.append('<div class=\"space-nut\"></div>');
        
        this.Elements.nutJqObj = $('#fretboard-nut');

        for(var fretNum = 1; fretNum <= displayLengths.length; fretNum++) {
            fretboardUnitHtml = this.getFretboardUnit(fretNum, displayLengths[fretNum - 1]);
            fretUnitHtml = this.getFret(fretNum);
            annotationHtml = this.getAnnotation(fretNum, displayLengths[fretNum - 1]);

            this.Elements.fretboardJqObj.append(fretboardUnitHtml);
            this.Elements.fretboardJqObj.append(fretUnitHtml);
            this.Elements.fretboardAnnotationsJqObj.append(annotationHtml);
        }
        
        this.Elements.fretJqObj = $('.fret').first();
        this.Elements.scoreOutputJqObj.html('0');
        
        $('.finger-position-unit').click(function() {
            FretboardQuizzer.markNote(this);
        });

        this.Elements.submitButtonJqObj.click(function() {
            FretboardQuizzer.evaluateQuiz();
        });

        this.Elements.resetButtonJqObj.click(function() {
            FretboardQuizzer.resetQuiz();
        });
        
        this.Elements.clearButtonJqObj.click(function() {
            FretboardQuizzer.clearMarkingOnAllStrings();
        });
    },

    ///////////////////////////////////////////////////////////////////////////
    /////   UTILITY   /////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    
    calculateWidth: function(totalWidth, nutWidth, fretWidth, fretNumber) {
        // remember, we have to factor in the width of the nut, as well as the frets.
        var difference = nutWidth + (fretWidth * fretNumber);
        var compensatedWidth = totalWidth - difference;
        console.log('totalWidth: ' + totalWidth + ', nutWidth: ' + nutWidth + ',fretWidth: ' + fretWidth);
        return compensatedWidth;
    },
    
    resizeFretboard: function() {
        var fretboardUnits = $('.fretboard-unit');
        var annotationUnits = $('.space-fretboard-unit');
        var fretboardDivWidth = this.Elements.fretboardJqObj.width();
        var calculatedWidth = 0;
        if(fretboardDivWidth < this.Constants.DEFAULT_WIDTH) {
            calculatedWidth = this.calculateWidth(this.Elements.fretboardJqObj.width(), this.Elements.nutJqObj.width(), this.Elements.fretJqObj.width(), this.Constants.NUM_FRETS);
            this.Elements.menuJqObj.outerWidth(this.Elements.fretboardJqObj.width());
            this.Elements.textContainerJqObj.outerWidth(this.Elements.fretboardJqObj.width());
        } else {
            calculatedWidth = this.calculateWidth(this.Constants.DEFAULT_WIDTH, this.Elements.nutJqObj.width(), this.Elements.fretJqObj.width(), this.Constants.NUM_FRETS);
            this.Elements.menuJqObj.outerWidth(this.Constants.DEFAULT_WIDTH);
            this.Elements.textContainerJqObj.outerWidth(this.Constants.DEFAULT_WIDTH);
        }
        console.log('calculatedWidth: ' + calculatedWidth + ', sumLengths:' + sumLengths);
        
        
        var newSectionLengths = this.getSectionLengths(calculatedWidth, this.Constants.NUM_FRETS);
        var sumLengths = 0;
        for(var i = 0; i < fretboardUnits.length; i++) {
            fretboardUnits[i].style.width = newSectionLengths[i];
            annotationUnits[i].style.width = newSectionLengths[i];
            sumLengths += newSectionLengths[i];
        }
        
    },
    
    ///////////////////////////////////////////////////////////////////////////
    /////   FRETBOARD MARKINGS   //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    
    clearMarkingOnAllStrings: function() {
        var selectorString = '.finger-position-unit.marked';
        $(selectorString).removeClass('marked');
    },
    
    clearMarkingOnString: function(stringNum) {
        var selectorString = '.finger-position-unit[data-coordinates^=\'' + stringNum + '\'] > .note-marker';
        $(selectorString).removeClass('marked');
    },
    
    markingExistsForString: function(stringNum) {
        if($.inArray(stringNum, this.markedStrings) > -1) {
            return true;
        } else {
            return false;
        }
    },
    
    markNote: function(stringUnitElement) {
        console.log("marking note...");
        var stringCoordsRaw = stringUnitElement.dataset.coordinates;
        var stringCoords = stringCoordsRaw.split(',');
        var stringNum = stringCoords[0];
        var fretNum = stringCoords[1];
        
        var markingJqObj = $('.finger-position-unit[data-coordinates=\'' + stringNum + ',' + fretNum +'\']');
        if(markingJqObj.length == 0) {
            if(this.markingExistsForString(stringNum)) {
                this.clearMarkingOnString(stringNum);
            }
            markingJqObj.addClass('marked');
            this.markedStrings.push(stringNum);
        } else {
            markingJqObj.removeClass('marked');
        }
    },
    
    ///////////////////////////////////////////////////////////////////////////
    /////   QUIZ PREPARATION   ////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    
    resetQuiz: function() {
        var randomIndex = Math.floor(Math.random() * 21);
        var currentNoteObj = this.Constants.NOTES[randomIndex];
        this.currentQuizNote = currentNoteObj;
        
        this.clearMarkingOnAllStrings();
        
        var imgSrc =  "img/" + this.currentQuizNote.name + '.png';
        this.Elements.noteImageJqObj.attr('src', imgSrc);
        this.Elements.textOutputJqObj.html('');
    },

    prepareQuiz: function() {
        this.resetQuiz();
    },
    
    ///////////////////////////////////////////////////////////////////////////
    /////   EVALUATION   //////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    
    evaluateQuiz: function() {
        var markers = $('.note-marker');
        var currentCoord = 0;
        var correctQuiz = true;
        var incorrectMarkers = 0;
        var correctMarkers = 0;
        
        for(var i = 0; i < markers.length; i++) {
            currentCoord = markers[i].parentElement.dataset.coordinates;
            if($.inArray(currentCoord, this.currentQuizNote.locations) == -1) {
                this.highlightMarker(false, markers[i]);
                correctQuiz = false;
                incorrectMarkers++;
            } else {
                this.highlightMarker(true, markers[i]);
                correctMarkers++;
            }
        }
        
        if(this.currentQuizNote.locations.length == markers.length && incorrectMarkers == 0) {
            correctQuiz = true;
            this.score++;
        } else {
            correctQuiz = false;
        }
        
        var markersLeftToCorrect = this.currentQuizNote.locations.length - correctMarkers;
        
        this.displayResultMessage(correctQuiz, markersLeftToCorrect);
    },
    
    highlightMarker: function(correctAnswer, markerObj) {
        var markerJqObj = $(markerObj);
        if(correctAnswer) {
            markerJqObj.removeClass('marker-wrong');
            markerJqObj.addClass('marker-correct');
        } else {
            markerJqObj.removeClass('marker-correct');
            markerJqObj.addClass('marker-wrong');
        }
    },
    
    displayResultMessage: function(correctQuiz, markersLeftToCorrect) {
        console.log('markersLeftToCorrect: ' + markersLeftToCorrect);
        if(correctQuiz) {
            this.prepareQuiz();
            this.Elements.scoreOutputJqObj.html(this.score);
            this.Elements.textOutputJqObj.html(this.Text.ALL_CORRECT);
            $('#fretboard-text-message').fadeOut(1600);
        } else {
            if(markersLeftToCorrect < this.currentQuizNote.locations.length) {
                var displayText = this.Text.N_MARKERS.replace(this.Constants.REPLACEMENT_STR, markersLeftToCorrect);
                this.Elements.textOutputJqObj.html(displayText);
            } else {
                this.Elements.textOutputJqObj.html(this.Text.ALL_ERROR);
            }
        }
    }
};

///////////////////////////////////////////////////////////////////////////////
/////   PAGE LOAD   ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    FretboardQuizzer.generateFretboard($('#fretboard-container'), FretboardQuizzer.Constants.NUM_FRETS);
    FretboardQuizzer.resizeFretboard();
    
    $(window).resize(function() {
        FretboardQuizzer.resizeFretboard();
    });
    
    FretboardQuizzer.prepareQuiz();
});
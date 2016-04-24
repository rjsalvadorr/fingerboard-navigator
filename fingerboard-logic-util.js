var FingerboardLogicUtil = {
    NUM_SEMITONE_INTERVALS: [
        {intervalNameRegex: "/minor (seco|2)nd/i", intervalValue: "1"},
        {intervalNameRegex: "/major (seco|2)nd/i", intervalValue: "2"},
        {intervalNameRegex: "/minor (thi|3)rd/i", intervalValue: "3"},
        {intervalNameRegex: "/major (thi|3)rd/i", intervalValue: "4"},
        {intervalNameRegex: "/perfect (four|4)th/i", intervalValue: "5"},
        {intervalNameRegex: "/(augmented (four|4)th|diminished (fif|5)th)/i", intervalValue: "6"},
        {intervalNameRegex: "/perfect (fif|5)th/i", intervalValue: "7"},
        {intervalNameRegex: "/minor (six|6)th/i", intervalValue: "8"},
        {intervalNameRegex: "/major (six|6)th/i", intervalValue: "9"},
        {intervalNameRegex: "/minor (seven|7)th/i", intervalValue: "10"},
        {intervalNameRegex: "/major (seven|7)th/i", intervalValue: "11"},
        {intervalNameRegex: "/octave/i", intervalValue: "12"}
    ],
    getIntervalDirection: function(directionString) {
        /*
        if (directionString matches "/(up|above)/i") {
            return 1;
        } else if(directionString matches "/(down|below)/i") {
            return -1;
        } else {
            return 0;
        }
        */
        return 0;
    },
    getAbsoluteIntervalAmount: function(intervalString) {
        for(var i = 0; i < this.NUM_SEMITONE_INTERVALS.length; i++) {
            /*
            if(this.NUM_SEMITONE_INTERVALS[i].intervalNameRegex matches intervalString) {
                return this.NUM_SEMITONE_INTERVALS[i].intervalValue;
            }
            */
        }
        return 0;
    },
    /*
        PARAMS
        pitchId::int
        interval::String
        direction::String
        
        RETURNS
        targetPitchId::int
    */
    getInterval: function(pitchId, intervalStr, directionStr) {
        var absIntervalAmt = this.getAbsoluteIntervalAmount(intervalStr);
        var intervalAmt = this.getIntervalDirection(directionStr) >= 0 ? absIntervalAmt : - absIntervalAmt ;
        var targetPitchId = pitchId + intervalAmt;
        
        return targetPitchId;
    }
};
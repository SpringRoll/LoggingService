(function(){
	
	/**
	 * The catalog name of events
	 * @class Events
	 * @namespace pbskids
	 * @static
	 */
	var Events = {
		"2000": "Start Game",
		"2010": "End Game",
		"2020": "Start Round",
		"2030": "End Round",
		"2040": "Start Level",
		"2050": "End Level",
		"2060": "Start Tutorial",
		"2070": "End Tutorial",
		"2075": "Skip Tutorial",
		"2080": "Start Movie",
		"2081": "Skip Movie",
		"2083": "End Movie",
		"3010": "Start Instruction",
		"3110": "End Instruction",
		"3020": "Start IncorrectFeedback",
		"3120": "End IncorrectFeedback",
		"3021": "Start CorrectFeedback",
		"3121": "End CorrectFeedback",
		"4010": "Select Level",
		"4020": "Select Answer",
		"4030": "Start Drag",
		"4035": "End DragOutside",
		"4070": "Off Click",
		"4080": "Dwell Time",
		"4090": "Click Help",
		"4095": "Click Replay",
		"4100": "Submit Answer"
	};

	/** 
	 * Get an event by name
	 * @method getName
	 */
	Events.getName = function(code)
	{
		var name = Events[String(code)];
		return !!name ? name : '';
	};

	// Assign to namespace
	namespace('pbskids').Events = Events;

}());
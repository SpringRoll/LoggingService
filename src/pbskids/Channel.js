(function(){
	
	/**
	 *  Represents a single channel/game
	 *  @class Channel
	 *  @namespace pbskids
	 *  @param {string} name The name of the channel
	 */
	var Channel = function(name)
	{
		/**
		 * The name of the game, human readable
		 * @property {string} name
		 */
		this.name = name;

		/**
		 * The DOM-safe id for the channel
		 * @property {string} id
		 */
		this.id = name.replace(/[^a-zA-Z0-9\-\_]/g, '').toLowerCase();

		/**
		 * The collection of progress tracker events, keep around to save
		 * @property {array} ptEvents
		 */
		this.ptEvents = [];

		/**
		 * The collection of google analytic events, keep around to save
		 * @property {array} gaEvents
		 */
		this.gaEvents = [];

		/**
		 * The collection of event to buffer before loading spec
		 * @property {Array} ptEventsBuffer
		 */
		this.ptEventsBuffer = [];

		/**
		 * The collection of event to buffer before loading spec
		 * @property {Array} gaEventsBuffer
		 */
		this.gaEventsBuffer = [];

		/**
		 * If we're waiting for the spec to load
		 * @property {Boolean} specLoading
		 */
		this.specLoading = false;

		/**
		 * The event specification, if no spec set to false
		 * @property {object|boolean} spec
		 */
		this.spec = null;
	};

	// Reference to the prototype
	var p = Channel.prototype;

	var PT = "pt";
	var GA = "ga";

	/**
	 *  Add a new events
	 *  @method add
	 *  @param {string} type Either "pt" or "ga"
	 *  @param {object} data The event data
	 */
	p.add = function(type, data)
	{
		if (type == PT)
			this.ptEvents.push(data);
		else if (type == GA)
			this.gaEvents.push(data);
	};

	/**
	 *  Get all the events
	 *  @method get
	 *  @param {string} type Either "pt" or "ga"
	 *  @return {array} The events
	 */
	p.get = function(type)
	{
		if (type == PT)
			return this.ptEvents;
		else if (type == GA)
			return this.gaEvents;
	};

	/**
	 *  Add a new events
	 *  @method addBuffer
	 *  @param {string} type Either "pt" or "ga"
	 *  @param {object} data The event data
	 */
	p.addBuffer = function(type, data)
	{
		if (type == PT)
			this.ptEventsBuffer.push(data);
		else if (type == GA)
			this.gaEventsBuffer.push(data);
	};

	/**
	 *  Clear events
	 *  @method clear
	 *  @param {string} type Either "pt" or "ga"
	 */
	p.clear = function(type)
	{
		if (type == PT)
			this.ptEvents.length = 0;
		else if (type == GA)
			this.gaEvents.length = 0;
	};

	/**
	 *  Clear events
	 *  @method getBuffer
	 *  @param {string} type Either "pt" or "ga"
	 *  @return {array} The list of events
	 */
	p.getBuffer = function(type)
	{
		if (type == PT)
			return this.ptEventsBuffer;
		else if (type == GA)
			return this.gaEventsBuffer;
	};

	/**
	 *  Remove, don't use after this
	 *  @method destroy
	 */
	p.destroy = function()
	{
		this.gaEventsBuffer = null;
		this.ptEventsBuffer = null;
		this.ptEvents = null;
		this.gaEvents = null;
	};

	namespace('pbskids').Channel = Channel;

}());
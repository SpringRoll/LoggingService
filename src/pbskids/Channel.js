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
		 * The event specification
		 * @property {object} spec
		 */
		this.spec = null;
	};

	// Reference to the prototype
	var p = Channel.prototype;

	/**
	 *  Add a new events
	 *  @method ptAdd
	 *  @param {object} data The event data
	 */
	p.ptAdd = function(data)
	{
		this.ptEvents.push(data);
	};

	/**
	 *  Add a new events
	 *  @method gaAdd
	 *  @param {object} data The event data
	 */
	p.gaAdd = function(data)
	{
		this.gaEvents.push(data);
	};

	/**
	 *  Clear events
	 *  @method ptClear
	 */
	p.ptClear = function()
	{
		this.ptEvents.length = 0;
	};

	/**
	 *  Clear events
	 *  @method gaClear
	 */
	p.gaClear = function()
	{
		this.gaEvents.length = 0;
	};		

	/**
	 *  Remove, don't use after this
	 *  @method destroy
	 */
	p.destroy = function()
	{
		this.ptEvents = null;
		this.gaEvents = null;
	};

	namespace('pbskids').Channel = Channel;

}());
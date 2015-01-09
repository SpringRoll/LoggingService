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
		 * The collection of events, keep around to save
		 * @property {array} events
		 */
		this.events = [];

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
	 *  @method add
	 *  @param {object} data The event data
	 */
	p.add = function(data)
	{
		this.events.push(data);
	};

	/**
	 *  Clear events
	 *  @method clear
	 */
	p.clear = function()
	{
		this.events.length = 0;
	};	

	/**
	 *  Remove, don't use after this
	 *  @method destroy
	 */
	p.destroy = function()
	{
		this.events = null;
	};

	namespace('pbskids').Channel = Channel;

}());
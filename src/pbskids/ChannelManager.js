(function(){

	if (APP)
	{
		var _ = require('lodash');
	}

	// Import classes
	var Channel = pbskids.Channel;

	/**
	 *  Manage the channel data
	 *  @class ChannelManager
	 *  @namespace pbskids
	 */
	var ChannelManager = function()
	{
		/**
		 * The collection of all channels
		 * @property {array} _channels
		 * @private
		 */
		this._channels = [];


		/**
		 *  How many channels are opened
		 *  @property {int} length
		 */
		this.length = 0;
	};

	// reference to the protptype
	var p = ChannelManager.prototype;

	/**
	 * Remove all channels 
	 * @method clear
	 */
	p.clear = function()
	{
		this.length = 0;
		this._channels.length = 0;
	};

	/**
	 * Create a new channel
	 * @method addChannel
	 * @param {string} name The name of the channel
	 * @return {pbskids.Channel} The added channel
	 */
	p.addChannel = function(name)
	{
		var channel = this.getChannelByName(name);
		if (!channel)
		{
			channel = new Channel(name);
			this._channels.push(channel);
			this.length++;
		}
		return channel;
	};

	/**
	 * Get a channel by id
	 * @method getChannel
	 * @param {string} id The id of the channel
	 * @return {pbskids.Channel} The added channel
	 */
	p.getChannel = function(id)
	{
		return _.first(
			_.filter(this._channels, function(channel){
				return channel.id == id;
			})
		);
	};

	/**
	 * Get a channel by name
	 * @method getChannelByName
	 * @param {string} name The name of the channel
	 * @return {pbskids.Channel} The added channel
	 */
	p.getChannelByName = function(name)
	{
		return _.first(
			_.filter(this._channels, function(channel){
				return channel.name == name;
			})
		);
	};

	/**
	 * Remove the channel by id
	 * @method removeChannel
	 * @param {string} id The id of the channel
	 * @return {pbskids.Channel} The added channel
	 */
	p.removeChannel = function(id)
	{
		// Remove the channel
		var channels = _.remove(this._channels, function(channel){
			return channel.id == id; 
		});

		// Destroy the removed channels
		_.each(channels, function(channel){
			channel.destroy();
			this.length--;
		}, this);
	};

	/**
	 * Add an event by channel name
	 * @method addPTEvent
	 * @param {string} name The name of the channel
	 * @param {object} data The data of the event
	 * @return {pbskids.Channel} The added channel
	 */
	p.addPTEvent = function(name, data)
	{
		var channel = this.getChannelByName(name);
		if (!channel)
		{
			throw "No channel found matching name '" + name + "'";
		}
		channel.ptAdd(data);
		return channel;
	};

	/**
	 * Add an event by channel name
	 * @method addGAEvent
	 * @param {string} name The name of the channel
	 * @param {object} data The data of the event
	 * @return {pbskids.Channel} The added channel
	 */
	p.addGAEvent = function(name, data)
	{
		var channel = this.getChannelByName(name);
		if (!channel)
		{
			throw "No channel found matching name '" + name + "'";
		}
		channel.gaAdd(data);
		return channel;
	};

	/**
	 *  Destroy and don't use after this
	 *  @method destroy
	 */
	p.destroy = function()
	{
		this.clear();
		this._channels = null;
	};

	// assign to namespace
	namespace('pbskids').ChannelManager = ChannelManager;

}());
(function(){
	
	if (APP)
	{
		var _ = require('lodash'),
			fs = require('fs');
	}

	var Browser = cloudkid.Browser;

	/**
	 * The interface UI tools
	 * @class Interface
	 * @namespace pbskids
	 */
	var Interface = function(removeCallback)
	{
		/**
		 * The UI element for the buttons
		 * @property {jquery} buttons
		 */
		this.buttons = $("#buttons")
			.on('click', '.select', this.onSelect.bind(this))
			.on('click', '.remove', this.onRemove.bind(this, removeCallback));

		/**
		 * The UI element for the channels
		 * @property {jquery} channels
		 */
		this.channels = $("#channels");

		/**
		 * The collection of templates
		 * @property {object} template
		 */
		this.templates = {};

		/**
		 * The current 
		 * @property {pbskids.Channel} current
		 */
		this.current = null;

		// Toggle the event displays
		this.channels.on('click', '.event-toggle', function(){
			$(this).parent().toggleClass('collapsed');
		});

		/**
		 * Export button for the current stage
		 * @property {jquery} exportButton
		 */
		this.exportButton = $("#exportButton")
			.click(this.onExport.bind(this));

		/**
		 * Clear the current events
		 * @property {jquery} clearButton
		 */
		this.clearButton = $("#clearButton")
			.click(this.onClear.bind(this)); 
	};

	// Reference to the prototype
	var p = Interface.prototype;

	/**
	 * Export the data for the current channel
	 * @method onExport
	 */
	p.onExport = function()
	{
		var data = JSON.stringify(this.current.events, null, "\t");
		Browser.saveAs(
			function(filename)
			{
				fs.writeFileSync(filename, data);
			},
			this.current.name + ".json"
		);
	};

	/**
	 * Export the data for the current channel
	 * @method onExport
	 */
	p.onClear = function()
	{
		this.current.clear();
		this.getChannel(this.current.id).children().remove();
		this.resetControls();
	};

	/**
	 * Add a new channel button
	 * @method addChannel
	 * @param {pbskids.Channel} channel
	 */
	p.addChannel = function(channel)
	{
		var list = this.getChannel(channel.id);

		// If the channel already exists, select it
		if (!list.length)
		{
			// Add the button
			this.buttons.append(
				this.getTemplate('channel-button', {
					id : channel.id,
					name : channel.name
				})
			);

			// Add the container for the events to show up
			this.channels.append(
				this.getTemplate('channel', {
					id : channel.id
				})
			);

			list = this.getChannel(channel.id);
			list.data('channel', channel);
		}

		this.selectChannel(channel.id);
	};

	/**
	 * Handler for the mouse click event
	 * @method onSelect
	 * @private
	 * @param {event} e Button click event
	 */
	p.onSelect = function(e)
	{
		var button = $(e.currentTarget);
		this.selectChannel(button.data('channel'));
	};

	/**
	 * Handler for the mouse click event to remove channel
	 * @method onRemove
	 * @private
	 * @param {event} e Button click event
	 */
	p.onRemove = function(callback, e)
	{
		var button = $(e.currentTarget);
		var channelId = button.data('channel');

		// Only reset the buttons if we're removing
		// the currently selected channel
		if (channelId == this.current.id)
		{
			this.resetControls();
		}
		this.getChannel(channelId).remove();
		button.parent().remove();
		callback(channelId);
	};

	/**
	 *  Disable the buttons
	 *  @method resetControls
	 */
	p.resetControls = function()
	{
		this.exportButton.addClass('disabled');
		this.clearButton.addClass('disabled');
	};

	/**
	 * Get a channel by id
	 * @method getChannel
	 * @param {string} channelId DOM id
	 * @return {jquery} The jquery object for channel
	 */
	p.getChannel = function(channelId)
	{
		return $("#" + channelId);
	};

	/**
	 * Select a channel
	 * @method selectChannel
	 * @param {int} channelId The channel unique ID
	 */
	p.selectChannel = function(channelId)
	{
		// Select the button
		this.buttons.find('.select').removeClass('active');
		this.buttons.find('#select-'+channelId).addClass('active');

		// Turn off all channels
		this.channels.children().hide();

		// Show the channel matching the id
		this.current = this.getChannel(channelId)
			.show()
			.data('channel');

		this.resetControls();
		if (this.current.events.length)
		{
			this.exportButton.removeClass('disabled');
			this.clearButton.removeClass('disabled');
		}
	};

	/**
	 * Select a channel
	 * @method addEvent
	 * @param {string} channelId The channel unique ID
	 * @param {object} data The data to add
	 */
	p.addEvent = function(channelId, data)
	{
		var channel = this.getChannel(channelId);
		if (channel.length)
		{
			data = _.cloneDeep(data);

			// Move the event code up a level
			// we'll exclude it from the list but still
			// will show it.
			data.event_code = data.event_data.event_code;
			delete data.event_data.event_code;

			_.each(data.event_data, function(value, name){
				data.event_data[name] = JSON.stringify(value);
			});

			this.exportButton.removeClass('disabled');
			this.clearButton.removeClass('disabled');
			channel.append($(this.getTemplate('channel-event', data)));
		}
		else
		{
			throw "Unable to find a channel in the interface " + channelId;
		}
	};

	/**
	 * Parse a template with the data
	 * @method getTemplate
	 * @param {string} id The name of the template
	 * @param {object} data Data to parse template with
	 */
	p.getTemplate = function(id, data)
	{
		if (!this.templates[id])
		{
			var template = fs.readFileSync(
				"assets/html/" + id + ".html",
				{encoding: "utf-8"}
			);
			this.templates[id] = template;
		}
		return _.template(this.templates[id])(data);
	};

	// Assign to namespace
	namespace('pbskids').Interface = Interface;

}());
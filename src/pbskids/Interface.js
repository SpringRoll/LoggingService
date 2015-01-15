(function(){
	
	if (APP)
	{
		var _ = require('lodash'),
			fs = require('fs'),
			ip = require('ip');
	}

	var Browser = cloudkid.Browser,
		Events = pbskids.Events,
		EventUtils = pbskids.EventUtils;

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

		/**
		 * Show Google Analytic Events
		 * @property {jquery} gaButton
		 */
		this.gaButton = $("#gaButton")
			.click(this.onGA.bind(this));

		/**
		 * Show Progress Tracker event
		 * @property {jquery} ptButton
		 */
		this.ptButton = $("#ptButton")
			.click(this.onPT.bind(this));

		/**
		 * If we're clear
		 * @property {boolean} isPT
		 */
		this.isPT = true;

		/**
		 * Filter list for the event codes
		 * @property {jquery} filterList
		 */
		this.filterList = $("#filterList")
			.change(this.onFilter.bind(this));

		// Add the local ip address
		$("#ipAddress").html(ip.address());

		this.enabled = false;
	};

	// Reference to the prototype
	var p = Interface.prototype;

	/**
	 * If the interface has any content
	 * @property {boolean} enabled
	 */
	Object.defineProperty(p, 'enabled', {
		set: function(enabled)
		{
			var body = $('body').removeClass('empty');
			if (!enabled)
			{
				body.addClass('empty');
			}
		}
	});

	/**
	 * Export the data for the current channel
	 * @method onExport
	 */
	p.onExport = function()
	{
		var events = this.isPT ? 
			this.current.ptEvents : 
			this.current.gaEvents;
			
		var data = JSON.stringify(events, null, "\t");
		Browser.saveAs(
			function(filename)
			{
				fs.writeFileSync(filename, data);
			},
			this.current.name + ".json"
		);
	};

	/**
	 * When GA button is clicked
	 * @method onGA
	 */
	p.onGA = function()
	{
		this.isPT = false;
		this.channels
			.removeClass('show-pt')
			.addClass('show-ga');

		this.gaButton.addClass('active');
		this.ptButton.removeClass('active');
		this.filterList.hide();

		this.refreshControls();
	};

	/**
	 * When PT button is clicked
	 * @method onPT
	 */
	p.onPT = function()
	{
		this.isPT = true;
		this.channels
			.removeClass('show-ga')
			.addClass('show-pt');

		this.ptButton.addClass('active');
		this.gaButton.removeClass('active');
		this.filterList.show();

		this.refreshControls();
		this.refreshFilters();
	};

	/**
	 * Handler for the filter change
	 * @method onFilter
	 */
	p.onFilter = function()
	{
		var code = parseInt(this.filterList.val());

		if (code)
		{
			$('.event').addClass('hidden')
				.filter('.code-'+code)
				.removeClass('hidden');
		}
		else
		{
			$('.event').removeClass('hidden');
		}
	};

	/**
	 * Export the data for the current channel
	 * @method onExport
	 */
	p.onClear = function()
	{
		if (this.isPT)
		{
			this.current.ptClear();
		}
		else
		{
			this.current.gaClear();
		}
		this.getChannel(this.current.id)
			.children(this.isPT ? ".pt" : ".ga")
			.remove();

		this.controlsEnabled = false;
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
			this.controlsEnabled = false;
		}
		this.getChannel(channelId).remove();
		button.parent().remove();
		callback(channelId);
	};

	/**
	 * Refresh the controls
	 * @method refreshControls
	 */
	p.refreshControls = function()
	{
		if (!this.current)
		{
			this.controlsEnabled = false;
		}

		this.controlsEnabled = this.isPT ? 
			!!this.current.ptEvents.length :
			!!this.current.gaEvents.length;
	};

	/**
	 *  Disable the buttons
	 *  @property {boolean} controlsEnabled
	 */
	Object.defineProperty(p, 'controlsEnabled', {
		set: function(enabled)
		{
			this.exportButton.removeClass('disabled');
			this.clearButton.removeClass('disabled');
			this.filterList.removeClass('disabled');

			if (!enabled)
			{
				this.exportButton.addClass('disabled');
				this.clearButton.addClass('disabled');
				this.filterList.addClass('disabled');
			}
		}
	});

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

		this.refreshControls();

		if (this.isPT)
		{
			this.refreshFilters();
		}
	};

	/**
	 * Select a channel
	 * @method addGAEvent
	 * @param {string} channelId The channel unique ID
	 * @param {object} data The data to add
	 */
	p.addGAEvent = function(channelId, data)
	{
		var channel = this.getChannel(channelId);
		if (!channel.length)
		{
			throw "Unable to find a channel in the interface " + channelId;
		}

		// Add the template to the DOM
		channel.append(
			$(this.getTemplate('channel-ga-event', data))
		);

		// Turn on the controls now that we have content
		this.controlsEnabled = true;
	};

	/**
	 * Select a channel
	 * @method addPTEvent
	 * @param {string} channelId The channel unique ID
	 * @param {object} data The data to add
	 */
	p.addPTEvent = function(channelId, data)
	{
		var channel = this.getChannel(channelId);
		if (!channel.length)
		{
			throw "Unable to find a channel in the interface " + channelId;
		}

		// Grab the event code
		var eventCode = data.event_data.event_code;

		var args = null;
		var eventError = null;
		var eventClass = '';
		var hasTypeError = false;

		if (this.current.spec)
		{
			args = this.current.spec[eventCode];
			args = args ? args.args : null;
		}

		// The collection of event data fields
		var eventFields = [];
		var eventDataCopy = _.clone(data.event_data);
		delete eventDataCopy.event_code;

		_.each(eventDataCopy, function(value, name){
			var message = null;
			var className = '';
			if (args)
			{
				try
				{
					EventUtils.validate(args, name, value);
				}
				catch(e)
				{
					hasTypeError = true;
					className = 'error';
					message = e.message;
					console.error(e.stack);
				}
			}
			eventFields.push({
				name: name, 
				value: JSON.stringify(value),
				message: message,
				className: className
			});
		}, this);

		if (args)
		{
			if (args.length != eventFields.length)
			{
				eventClass = 'error';
				eventError = "Incorrect number of arguments, expecting " + 
					args.length + " but got " + eventFields.length;
			}
			else if (hasTypeError)
			{
				eventClass = 'error';
			}
			else
			{
				eventClass = 'success';
			}
		}

		// Add the template to the DOM
		channel.append(
			$(this.getTemplate('channel-pt-event', {
				eventCode: eventCode,
				name: Events.getName(eventCode),
				eventFields: eventFields,
				eventClass: eventClass,
				eventError: eventError
			}))
		);

		// Turn on the controls now that we have content
		this.controlsEnabled = true;

		// Refresh the filter selection
		this.refreshFilters();
	};

	/**
	 * Refresh the list of filters in the dropdown
	 * @method refreshFilters
	 */
	p.refreshFilters = function()
	{
		var selection = parseInt(this.filterList.val());

		// remove all
		this.filterList.children(".code").remove();

		if (this.current && this.current.ptEvents.length)
		{
			// Find all the unique event code
			var codes = [];
			_.each(this.current.ptEvents, function(event){
				var code = event.event_data.event_code;
				if (codes.indexOf(code) === -1)
				{
					codes.push(code);
				}
			});

			// Order the code
			codes.sort();

			// Add the options to the list
			_.each(codes, function(code){
				this.filterList.append(
					this.getTemplate('option', { 
						value: code,
						name: Events.getName(code),
						selected: code == selection ? 'selected' : ''
					})
				);
			}, this);
		}
		this.onFilter();
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
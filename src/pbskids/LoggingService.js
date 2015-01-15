(function(undefined){

	// Import classes
	var NodeWebkitApp = cloudkid.NodeWebkitApp,
		ChannelManager = pbskids.ChannelManager,
		Interface = pbskids.Interface;

	if (APP)
	{
		var WebSocketServer = require('ws').Server;
	}

	/**
	*  Node Webkit Application
	*  @class LoggingService
	*  @extends cloudkid.NodeWebkitApp
	*/
	var LoggingService = function()
	{
		NodeWebkitApp.call(this);

		/**
		 * The new websocket server
		 * @property {WebSocketServer} server
		 */
		this.server = null;

		if (APP)
		{
			// Create the standard OSX menu
			if (process.platform === "darwin")
			{	
				var gui = require('nw.gui');
				var menu = new gui.Menu({ type: 'menubar' });
				menu.createMacBuiltin("LoggingService");
				gui.Window.get().menu = menu;
			}

			this.server = new WebSocketServer({port: 1025});
			this.server.on('connection', this._onInit.bind(this));
		}

		/**
		 *  The collection of all channel information
		 *  @property {pbskids.ChannelManager} channels
		 */
		this.channels = new ChannelManager();

		/**
		 *  The interface GUI
		 *  @property {pbskids.Interface} ui
		 */
		this.ui = new Interface(this.onRemove.bind(this));

		// Show the GUI
		this.main.show();
	};

	// Reference to the prototype
	var p = LoggingService.prototype = Object.create(NodeWebkitApp.prototype);

	/**
	*  When the WebSocketServer is initialized
	*  @method  _onInit
	*  @private
	*  @param  {WebSocket} ws The websocket instance
	*/
	p._onInit = function(ws)
	{
		ws.on('message', this._onMessage.bind(this));
	};

	/**
	*  Removed
	*  @method  onRemove
	*  @private
	*  @param  {string} channelId Channel id
	*/
	p.onRemove = function(channelId)
	{
		this.channels.removeChannel(channelId);

		if (!this.channels.length)
		{
			this.ui.enabled = false;
		}
	};

	/**
	*  Callback when a message is received by the server
	*  @method _onMessage
	*  @private
	*  @param  {string} result The result object to be parsed as JSON
	*/
	p._onMessage = function(result)
	{
		var response, channel;
		try
		{
			response = JSON.parse(result);
		}
		catch(e)
		{
			console.error("Unable to parse " + result);
			return;
		}

		if (!response.type)
		{
			console.warn("Message type not recognized: " + response.type);
			return;
		}

		switch(response.type)
		{
			case "session": 
			{
				this.newChannel(response.channel);
				break;
			}
			case "pt-event":
			case "event":
			{
				channel = this.channels.getChannel(response.channel);
				if (!channel)
				{
					channel = this.newChannel(response.channel);
				}
				channel = this.channels.addPTEvent(
					channel.id,
					response.data
				);
				this.ui.addPTEvent(channel.id, response.data);
				break;
			}
			case "ga-event":
			{
				channel = this.channels.getChannel(response.channel);
				if (!channel)
				{
					channel = this.newChannel(response.channel);
				}
				channel = this.channels.addGAEvent(
					channel.id,
					response.data
				);
				break;
			}
		}
	};

	/**
	 * Create a new channel
	 * @method newChannel
	 * @param {string} channelId The channel id
	 */
	p.newChannel = function(channelId)
	{
		channel = this.channels.addChannel(channelId);
		this.ui.addChannel(channel);
		this.ui.enabled = true;

		// Download the spec if it's available
		var specUrl = 'http://stage.pbskids.org/progresstracker/'+
			'api/v2/games/'+channelId+'/events-spec.json';

		$.getJSON(specUrl, function(result){
			channel.spec = result.events;
		}).fail(function(){
			alert("Unable to load an event specification for this game. Event validation will be ignored.");
		});
		return channel;
	};

	/**
	*  Called when the application is quit. Should do any cleanup here to be safe.
	*  @method close
	*/
	p.close = function()
	{
		if (this.channels)
		{
			this.channels.destroy();
			this.channels = null;
		}

		if (this.server)
		{
			this.server.close();
			this.server = null;
		}
	};

	// Create the application
	$(function(){ window.app = new LoggingService(); });

}());
module.exports = {
	debug: {
		options: {
			pretty: true,
			data: {
				debug: true,
				name: "<%= project.name %>",
				version: "<%= project.version %>"
			}
		},
		files: {
			"<%= distFolder %>/index.html": "src/jade/index.jade"
		}
	},
	release: {
		options: {
			data: {
				debug: false,
				name: "<%= project.name %>",
				version: "<%= project.version %>"
			}
		},
		files: "<%= jade.debug.files %>"
	}
};
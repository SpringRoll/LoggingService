(function(){
	
	if (APP)
	{
		var _ = require('lodash');
	}

	var ValidationError = pbskids.ValidationError;

	/**
	 * Utilities for dealing with event data
	 * @class EventUtils
	 */
	var EventUtils = {};

	/**
	 * Validate the event args
	 * @method validate
	 * @param {array} arg The list of arguments
	 * @param {string} name The name of the event data arg
	 * @param {*} value The value of the argument
	 */
	EventUtils.validate = function(args, name, value)
	{
		for (var arg, i = 0; i < args.length; i++)
		{
			arg = args[i];
			if (arg.name == name)
			{
				validateValue(arg.type, value, arg.args, name);
			}
		}
	};

	/**
	 *  Do the actual type validation on a specific value
	 *  @method _validate
	 *  @private
	 *  @constructor
	 *  @param {string|Array} type The type of value, if an array a set of valid items
	 *  @param {*} value The value to test against
	 *  @param {array} args The list of properties to validate if a typed object
	 */
	var validateValue = function(type, value, args, parent)
	{
		//Check for empty values
		if (value === undefined || value === null)
		{
			throw new ValidationError("Supplied value is empty", parent, value);
		}

		//wildcard don't validate
		if (type === "*") return;

		//validate vanilla strings, ints and numbers
		if ((type === "string" && typeof value !== type) ||
			(type === "int" && parseInt(value) !== value) ||
			(type === "number" && parseFloat(value) !== value) ||
			(type === "array" && !Array.isArray(value)) ||
			(type === "boolean" && typeof value !== type) ||
			(type === "object" && typeof value !== type))
		{
			throw new ValidationError("Not a valid " + type, parent, value);
		}

		var i, len;

		//Can check for typed arrays, such as an array
		//filled with only ints, strings or numbers
		if (/^array\-\>(int|boolean|string|number|array|object)$/.test(type))
		{
			if (!Array.isArray(value))
			{
				throw new ValidationError(
					"Not a valid " + type,
					parent,
					value
				);
			}

			//Validate each argument on the array
			var arrayType = type.replace("array->", "");
			for (i = 0, len = value.length; i < len; i++)
			{
				try
				{
					validateValue(arrayType, value[i], args, parent);
				}
				catch (e)
				{
					throw new ValidationError(
						"Invalid " + type + " at index " + i,
						parent,
						value
					);
				}
			}
		}

		//Validate set items
		if (Array.isArray(type) && type.indexOf(value) === -1)
		{
			throw new ValidationError(
				"Value is not valid in set",
				parent,
				value
			);
		}

		//Validate properties of an object
		if (type === "object" && !!args)
		{
			len = args.length;
			for (i = 0; i < len; i++)
			{
				var prop = args[i];
				validateValue(
					prop.type,
					value[prop.name],
					prop.args,
					parent + "." + prop.name
				);
			}
		}
	};

	// Assign to namespace
	namespace('pbskids').EventUtils = EventUtils;

}());
/**
 *  @module Progress Tracker
 *  @namespace pbskids
 */
(function()
{
	/**
	 *  Error when validating value by Progress Tracker
	 *  @class ValidationError
	 *  @extends pbskids.EventError
	 *  @constructor
	 *  @param {string} message The error message
	 *  @param {string} property The name of the property
	 */
	var ValidationError = function(message, property, value)
	{
		var e = Error.call(this, message);

		/**
		 *  The name of the property erroring on
		 *  @property {string} property
		 */
		this.property = property;

		/**
		 *  The error message
		 *  @property {string} message
		 */
		this.message = message;

		/**
		 *  The supplied value, if any
		 *  @property {*} value
		 */
		this.value = value;

		/**
		 *  The stack trace
		 *  @property {string} stack
		 */
		this.stack = e.stack;
	};

	//Extend the Error class
	var p = ValidationError.prototype = Object.create(Error.prototype);

	//Assign the constructor
	ValidationError.prototype.constructor = ValidationError;

	/**
	 *  To string override
	 *  @method toString
	 *  @return {string} The string representation of the error
	 */
	p.toString = function()
	{
		return this.message + " [property: '" + this.property +
			"', value: '" + JSON.stringify(this.value) +
			"', eventCode: " + this.eventCode +
			", api: '" + this.api + "']";
	};

	//Assign to namespace
	namespace('pbskids').ValidationError = ValidationError;
}());

'use strict';

// MODULES //

var isObject = require( 'validate.io-object' ),
	isString = require( 'validate.io-string-primitive' ),
	isFunction = require( 'validate.io-function' ),
	contains = require( 'validate.io-contains' ),
	fs = require( 'fs' ),
	path = require( 'path' ),
	noop = require( '@kgryte/noop' ),
	templates = require( './templates.js' );


// COPY //

/**
* FUNCTION: cp( dest[, opts ][, clbk ] )
*	Asynchronously creates a .jshintignore file.
*
* @param {String} dest - .jshintignore destination directory
* @param {Object} [opts] - function options
* @param {String} [opts.template="default"] - .jshintignore template to use
* @param {Function} [clbk] - callback to invoke upon attempting to create a .jshintignore file
*/
function cp() {
	var args = arguments,
		nargs = args.length,
		tmpl = 'default',
		rStream,
		wStream,
		fpath,
		dpath,
		opts,
		dest,
		clbk;

	if ( !nargs ) {
		throw new Error( 'cp()::insufficient input arguments. Must provide a file destination.' );
	}
	dest = args[ 0 ];
	if ( !isString( dest ) ) {
		throw new TypeError( 'cp()::invalid input argument. First argument must be a string primitive. Value: `' + dest + '`.' );
	}
	if ( nargs === 1 ) {
		clbk = noop;
	}
	else if ( nargs === 2 ) {
		if ( isObject( args[ 1 ] ) ) {
			opts = args[ 1 ];
			clbk = noop;
		}
		else if ( isFunction( args[ 1 ] ) ) {
			clbk = args[ 1 ];
		}
		else {
			throw new TypeError( 'cp()::invalid input argument. Second argument must either be an options object or a callback. Value: `' + args[ 1 ] + '`.' );
		}
	}
	else {
		opts = args[ 1 ];
		clbk = args[ 2 ];
		if ( !isObject( opts ) ) {
			throw new TypeError( 'cp()::invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
		}
		if ( !isFunction( clbk ) ) {
			throw new TypeError( 'cp()::invalid input argument. Callback argument must be a function. Value: `' + clbk + '`.' );
		}
	}
	if ( opts ) {
		if ( opts.hasOwnProperty( 'template' ) ) {
			tmpl = opts.template;
			if ( !isString( tmpl ) ) {
				throw new TypeError( 'cp()::invalid option. Template option must be a string primitive. Option: `' + tmpl + '`.' );
			}
			if ( !contains( templates, tmpl ) ) {
				throw new Error( 'cp()::invalid option. Unrecognized template name. Must be one of [' + templates.join( ',' ) + '] Option: `' + tmpl + '`.' );
			}
		}
	}
	fpath = path.join( __dirname, tmpl, '.jshintignore' );
	dpath = path.join( dest, '.jshintignore' );

	rStream = fs.createReadStream( fpath );
	wStream = fs.createWriteStream( dpath );

	wStream.on( 'error', onError );
	wStream.on( 'finish', onFinish );

	rStream.pipe( wStream );

	/**
	* FUNCTION: onError( error )
	*	Callback invoked upon a writeStream error.
	*
	* @private
	* @param {Error} error - error object
	*/
	function onError( error ) {
		clbk( error );
	}

	/**
	* FUNCTION: onFinish()
	*	Callback invoked once a writeStream is finished writing.
	*
	* @private
	*/
	function onFinish() {
		clbk();
	}
} // end FUNCTION cp()


// EXPORTS //

module.exports = cp;

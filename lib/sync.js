'use strict';

// MODULES //

var isString = require( 'validate.io-string-primitive' ),
	isObject = require( 'validate.io-object' ),
	contains = require( 'validate.io-contains' ),
	templates = require( './templates' ),
	path = require( 'path' ),
	fs = require( 'fs' );


// COPY //

/**
* FUNCTION: cp( dest[, opts ] )
*	Synchronously creates a .jshintignore file.
*
* @param {String} dest - .jshintignore destination directory
* @param {Object} [opts] - function options
* @param {String} [opts.template="default"] - .jshintignore template to use
*/
function cp( dest, opts ) {
	var tmpl = 'default',
		fpath,
		dpath;

	if ( !isString( dest ) ) {
		throw new TypeError( 'cp()::invalid input argument. First argument must be a string primitive. Value: `' + dest + '`.' );
	}
	if ( arguments.length > 1 ) {
		if ( !isObject( opts ) ) {
			throw new TypeError( 'cp()::invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
		}
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

	fs.writeFileSync( dpath, fs.readFileSync( fpath ) );
} // end FUNCTION cp()


// EXPORTS //

module.exports = cp;

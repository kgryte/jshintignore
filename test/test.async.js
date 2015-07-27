/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Recursively make directories:
	mkdirp = require( 'mkdirp' ),

	// Path module:
	path = require( 'path' ),

	// Filesystem module:
	fs = require( 'fs' ),

	// Module to be tested:
	cp = require( './../lib/async.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'async', function tests() {

	it( 'should export a function', function test() {
		expect( cp ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided a destination', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			cp();
		}
	});

	it( 'should throw an error if not provided a valid destination directory', function test() {
		var values = [
			5,
			null,
			true,
			undefined,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				cp( value );
			};
		}
	});

	it( 'should throw an error if not provided a valid options argument', function test() {
		var values = [
			'beep',
			5,
			null,
			true,
			undefined,
			NaN,
			[],
			// function(){} // allowed as fcn is variadic
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( TypeError );
			expect( badValue2( values[i] ) ).to.throw( TypeError );
		}
		function badValue1( value ) {
			return function() {
				cp( './beep/boop', value );
			};
		}
		function badValue2( value ) {
			return function() {
				cp( './beep/boop', value, function(){} );
			};
		}
	});

	it( 'should throw an error if provided a callback argument which is not a function', function test() {
		var values = [
			'beep',
			5,
			null,
			true,
			undefined,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				cp( './beep/boop', {}, value );
			};
		}
	});

	it( 'should throw an error if provided a template option which is not a string primitive', function test() {
		var values = [
			5,
			null,
			true,
			undefined,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				cp( './beep/boop', {
					'template': value
				});
			};
		}
	});

	it( 'should throw an error if provided an unrecognized template option', function test() {
		var values = [
			'beep',
			'boop',
			'woot'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				cp( './beep/boop', {
					'template': value
				});
			};
		}
	});

	it( 'should create a .jshintignore file in a specified directory', function test() {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath, onFinish );

		function onFinish( error ) {
			if ( error ) {
				assert.ok( false );
				return;
			}
			var bool = fs.existsSync( path.join( dirpath, '.jshintignore' ) );

			assert.isTrue( bool );
		}
	});

	it( 'should pass any write errors to a provided callback', function test() {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		cp( dirpath, onFinish );

		function onFinish( error ) {
			if ( error ) {
				assert.ok( true );
				return;
			}
			assert.ok( false );
		}
	});

	it( 'should create a .jshintignore file in a specified directory without requiring a callback', function test() {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath );

		setTimeout( onTimeout, 500 );

		function onTimeout() {
			var bool = fs.existsSync( path.join( dirpath, '.jshintignore' ) );

			assert.isTrue( bool );
		}
	});

	it( 'should create a .jshintignore file using a specified template', function test() {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath, {
			'template': 'default'
		}, onFinish );

		function onFinish( error ) {
			var fpath1,
				fpath2,
				f1, f2;

			if ( error ) {
				assert.ok( false );
				return;
			}
			fpath1 = path.join( dirpath, '.jshintignore' );
			f1 = fs.readFileSync( fpath1 );

			fpath2 = path.join( path.resolve( __dirname, '../lib/default' ), '.jshintignore' );
			f2 = fs.readFileSync( fpath2 );

			assert.strictEqual( f1, f2 );
		}
	});

	it( 'should ignore any unrecognized options', function test() {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath, {
			'beep': 'boop'
		}, onFinish );

		function onFinish( error ) {
			if ( error ) {
				assert.ok( false );
				return;
			}
			var bool = fs.existsSync( path.join( dirpath, '.jshintignore' ) );

			assert.isTrue( bool );
		}
	});

});

var async = require( "async" ),
	expect = require( "chai" ).expect,
	fs = require( "fs" ),
	jQueryCSSBuilder = require( "../index.js" );

describe( "jQuery CSS Builder", function() {
	var files = {
		"foo.js": fs.readFileSync( __dirname + "/fixtures/basic/foo.js" ),
		"bar.js": fs.readFileSync( __dirname + "/fixtures/basic/bar.js" ),
		"foo.css": fs.readFileSync( __dirname + "/fixtures/basic/foo.css" ),
		"bar.css": fs.readFileSync( __dirname + "/fixtures/basic/bar.css" ),
	};

	describe( "Basic", function() {
		var css;

		before(function( done ) {
			jQueryCSSBuilder( files, "baz", { include: [ "foo" ] }, function( error, _css ) {
				css = _css;
				done( error );
			});
		});

		it( "should build just fine", function() {
			expect( css ).to.equal( ".foo {}\n.bar {}\n" );
		});

	});

	describe( "Basic - using appDir", function() {
		var css,
			files = {
				"fixtures/foo.js": fs.readFileSync( __dirname + "/fixtures/basic/foo.js" ),
				"fixtures/bar.js": fs.readFileSync( __dirname + "/fixtures/basic/bar.js" ),
				"fixtures/foo.css": fs.readFileSync( __dirname + "/fixtures/basic/foo.css" ),
				"fixtures/bar.css": fs.readFileSync( __dirname + "/fixtures/basic/bar.css" ),
			};

		before(function( done ) {
			jQueryCSSBuilder( files, "baz", { appDir: "fixtures", include: [ "foo" ] }, function( error, _css ) {
				css = _css;
				done( error );
			});
		});

		it( "should build just fine", function() {
			expect( css ).to.equal( ".foo {}\n.bar {}\n" );
		});

	});

	describe( "Two bundles", function() {
		var cssNorth, cssSouth;
		var files = {
			"foo.js": fs.readFileSync( __dirname + "/fixtures/two-bundles/foo.js" ),
			"bar.js": fs.readFileSync( __dirname + "/fixtures/two-bundles/bar.js" ),
			"baz.js": fs.readFileSync( __dirname + "/fixtures/two-bundles/baz.js" ),
			"foo.css": fs.readFileSync( __dirname + "/fixtures/two-bundles/foo.css" ),
			"bar.css": fs.readFileSync( __dirname + "/fixtures/two-bundles/bar.css" ),
			"baz.css": fs.readFileSync( __dirname + "/fixtures/two-bundles/baz.css" ),
		};

		before(function( done ) {
			async.series([
				function( callback ) {
					jQueryCSSBuilder( files, "north", { include: [ "foo" ] }, callback );
				},
				function( callback ) {
					jQueryCSSBuilder( files, "south", { include: [ "foo" ] }, callback );
				}
			], function( error, result ) {
				cssNorth = result[ 0 ][ 0 ];
				cssSouth = result[ 1 ][ 0 ];
				done( error );
			});
		});

		it( "should build just fine", function() {
			expect( cssNorth ).to.equal( ".bar {}\n.baz {}\n" );
			expect( cssSouth ).to.equal( ".foo {}\n" );
		});

	});

	describe( "Empty bundle", function() {
		var result;

		before(function( done ) {
			jQueryCSSBuilder( files, "nonexistent", { include: [ "foo" ] }, function( error, _result ) {
				result = _result;
				done( error );
			});
		});

		it( "should build just fine", function() {
			expect( result ).to.equal( "" );
		});

	});
});

var amdCssBuilder = require( "builder-amd-css" );

function cssDependencies( data, which ) {
	var result = [],
		regexp = new RegExp( "\\/\\/>>\\s*css\\." + which + ":(.*)", "g" );

	data.replace( regexp, function( garbage, input ) {
		input = input.split( "," ).map( trim ); 
		result.push.apply( result, input );
	});

	return result.map(function( cssDependency ) {
		return "\"css!" + cssDependency.replace( /\.css$/i, "" ) + "\"";
	});
}

function jsDependencies( data ) {
	var match,
		result = [];

	match = data.match( /define\(\[([^\]]*?)\]/ );
	if ( match !== null ) {
		result = match[ 1 ].split( "," ).map( trim );
	}
	
	return result;
}

/**
 * transform( data, which )
 *
 * @data [String] File content.
 *
 * @which [String] The name of the css bundle selector.
 *
 * Parse the syntax (a) and transform it into the AMD definition (b).
 *
 * a: //>> css.<which>: cssFile1, cssFile2, ...
 *    define([ "foo", "bar" ], function() { ... });
 *
 * b: define([ "css!cssFile1", "css!cssFile2", "css!...", "foo", "bar" ]);
 */
function transform( data, which ) {
	var dependencies = [];

	dependencies.push.apply( dependencies, cssDependencies( data, which ) );
	dependencies.push.apply( dependencies, jsDependencies( data ) );

	return "define([" + dependencies.join( ", " ) + "]);";
}

// Helper: trim.
function trim( string ) {
	return string.trim();
}

/**
 * transformFiles( files, which )
 *
 * @files [Object]
 *
 * @which [String] The name of the css bundle selector.
 *
 * Transform the content of each file according to `transform()`.
 * The original files Object is preserved intact.
 */
function transformFiles( files, which ) {
	var transformedFiles = {};
	Object.keys( files ).forEach(function( path ) {
		var data;
		if ( /\.js$/.test( path ) ) {
			data = files[ path ].toString( "utf-8" );
			transformedFiles[ path ] = transform( data, which );
		} else if ( /\.css$/.test( path ) ) {
			transformedFiles[ path ] = files[ path ].toString( "utf-8" );
		} else {
			transformedFiles[ path ] = files[ path ];
		}
	});
	return transformedFiles;
}


/**
 * jqueryCssBuilder( files, which, config, callback )
 */
module.exports = function( files, which, config, callback ) {
	var transformedFiles = transformFiles( files, which );
	amdCssBuilder( transformedFiles, config, callback );
};

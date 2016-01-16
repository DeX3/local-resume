'use strict';

var deps = require( '../package.json' ).dependencies;

module.exports = {};

_.filter( deps, function( version, name ) {
  
  var m = name.match( /^.*jsonresume-theme-(.*)$/ );

  if( m ) {
    module.exports[m[1]] = require( name );
  }
} );


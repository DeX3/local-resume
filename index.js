'use strict';

GLOBAL._ = require( 'lodash' );
GLOBAL.Promise = require( 'bluebird' );

var themes = require( './themes' );
var formats = require( './formats' );
var path = require( 'path' );
var yargs = require( 'yargs' );
var fs = require( 'fs-extra-promise' );
var watchr = require( 'watchr' );

var argv = yargs
.string( 't' )
.alias( 't', 'theme' )
.default( 't', 'paper' )
.boolean( 'w' )
.alias( 'w', 'watch' )
.default( 'w', false )
.argv;

var theme = argv.theme;
if( !(theme in themes) ) {
  console.error( 'Unknown theme', theme, '!' );
  process.exit( 1 );
}

var resumePath = argv._[0] || 'resume.json';

var ext = path.extname( resumePath );
var outPath = path.basename( resumePath, ext ) + '.html';

if( !(ext in formats) ) {
  console.error( 'Unknown format', ext, '!' );
  process.exit( 1 );
}

compile()
.then( () => {

  if( !argv.watch ) {
    return;
  }

  watchr.watch( {
    path: resumePath,
    listeners: {
      change: function() {
        console.log( resumePath, 'changed, recompiling...' );
        compile();
      }
    }
  } );
} );

function compile() {

  var resume = formats[ext]( resumePath );
  var html = themes[argv.theme].render( resume );

  return fs.writeFileAsync( outPath, html )
  .then( () => {
    console.log( outPath, 'written!' );
  } );
}

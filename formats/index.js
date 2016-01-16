'use strict';

var yamljs = require( 'yamljs' );

module.exports = {

  '.yml': parseYaml,
  '.yaml': parseYaml,

  '.json': function( path ) {
    return require( path );
  }

};

function parseYaml( path ) {
  return yamljs.load( path );
}

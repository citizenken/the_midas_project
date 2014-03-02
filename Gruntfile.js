/* jshint node:true */

// install git
// install node.js => http://nodejs.org/
// run: npm install grunt-cli -g
// then: npm install

module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        // for production
        beautify: false, // format the output (de-minifies)
        compress: true, // minify code
        mangle: true// minify variable names
        // for sharing
        // beautify: true, // format the output (de-minifies)
        // compress: false, // minify code
        // mangle: false // minify variable names
      },
      gtc: {
        files: {
          'lib/the_midas_project.js': [
            'lib/crafty.js',
            //'src/game.js',
            /*'src/components.js',*/
            //'src/scenes.js',
            //'src/components/**/*.js',
            'src/**/*.js'
          ],
          'lib/map_editor.js': [
            'lib/crafty.js',
            'map_editor/src/**/*.js']
        }
      }
    },
    watch: {
      js: {
        files: ['src/**/*.js', 'map_editor/src/**/*.js'],
        tasks: ['uglify']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
};
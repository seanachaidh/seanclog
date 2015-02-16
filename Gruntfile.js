module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		nggettext_extract: {
			pot: {
				files: {
					'po/template.pot': [
						'public/partials/*.html',
						'public/partials/forms/*.html'
					]
				}
			}
		},
		nggettext_compile: {
			all: {
				files: {
					'public/translations.js': ['po/*.po']
				},
				options: {
					module: 'seanclogApp'
				}
			}
		},
		bower: {
			install: {
				options: {
					targetDir: 'bower_components',
					install: true
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-angular-gettext');
	grunt.loadNpmTasks('grunt-bower-task');
	
	grunt.registerTask('default', ['nggettext_compile', 'bower']);
};


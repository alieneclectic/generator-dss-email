"use strict"

module.exports = function (grunt) {

    grunt.initConfig({

        lint_pattern: {
            HTML: {
                options: {
                    rules: [{
                        pattern: /width=\"\"/,
                        message: 'Remove empty width attribute.'
                        }, {
                        pattern: /height=\"\"/,
                        message: 'Remove empty height attribute.'
                        }, {
                        pattern: /height=\"0\"/,
                        message: 'Remove 0 height attribute.'
                        }, {
                        pattern: /width=\"0\"/,
                        message: 'Remove 0 width attribute.'
                        }, {
                        pattern: /\/\>/,
                        message: 'Remove self closing tag.'
                        }, {
                        pattern: /\/ \>/,
                        message: 'Remove self closing tag.'
                        }, {
                        pattern: /\<div/,
                        message: 'Remove <div> tags, use table, tr, td, tags only.'
                        }, {
                        pattern: /\<p/,
                        message: 'Remove <p> tags, they do not retain their styling specifications across all clients.'
                        }, {
                        pattern: /\<sup/,
                        message: 'Remove <sup> tags, use <span style="line-height: 0; font-size:[desired px]; vertical-align: [desired height]"> instead.'
                        }, {
                        pattern: /\<ul/,
                        message: 'Remove <ul> tags, they do not retain their styling specifications across all clients.'
                        }, {
                        pattern: /\<ol/,
                        message: 'Remove <ol> tags, they do not retain their styling specifications across all clients.'
                        }, {
                        pattern: /\<br/,
                        message: 'Remove <br> tags, they will jeopardize the layout for responsive sites.'
                        }, {
                        pattern: /rowspan/,
                        message: 'Use nested tables instead of rowspan.'
                        }, {
                        pattern: /colspan/,
                        message: 'Use nested tables instead of colspan.'
                        }, {
                        pattern: /\<script/,
                        message: 'NEVER use embedded client-side scripting (JavaScript).'
                        }, {
                        pattern: /\&bullet\;/,
                        message: 'Use &bull; instead of &bullet;' 
                        }, {
                        pattern: /Transitional\.dtd/,
                        message: 'Please use the loose doctype version: <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'  
                        }]
                },
                files: {
                    path: 'src/index.html'
                }
            }
        },
        copy: {
            src: {
                files: [
                    {
                        expand: true,
                        cwd: "src/css",
                        src: ["**"],
                        dest: "tmp/css"
                    },
                    {
                        expand: true,
                        cwd: "src/images",
                        src: ["**"],
                        dest: "tmp/images"
                    },
                    {
                        expand: true,
                        cwd: "src",
                        src: ["*.html"],
                        dest: "tmp"
                    }]
            },
            tmp: {
                files: [
                    {
                        expand: true,
                        cwd: "tmp",
                        src: ["*.html"],
                        dest: "dist"
                    }
        ]
            }
        },

        connect: {
            options: {
                port: "8080",
                useAvailablePort: true,
                livereload: true,
                open: true
            },
            dev: {
                options: {
                    base: "tmp/"
                }
            }
        },

        watch: {
            src: {
                files: ["src/css/**/*.{<%= syntax %>}", "src/images/**/*.{gif,png,jpg,jpeg}", "src/**/*.html"],
                tasks: ["lint_pattern:HTML", "build:development"],
                options: {
                    livereload: true
                }
            }
        },

        <%
        if (stylesheet === "sass") { %>
                sass: {
                    compile: {
                        files: {
                            "tmp/css/core.css": "src/css/core.<%= syntax %>"
                        }
                    }
            },
            <%
        } %>

        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "tmp/images",
                        src: ["**/*.{png,jpg,jpeg}"],
                        dest: "dist/images"
                    }
        ]
            }
        },

        uncss: {
            dist: {
                files: {
                    "tmp/css/core.css": ["tmp/index.html"]
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    "tmp/index.html": "tmp/index.html"
                }
            }
        },

        premailer: {
            options: {
                removeClasses: true
            },
            dist: {
                files: {
                    "tmp/index.html": "tmp/index.html"
                }
            }
        }
    });

    grunt.registerTask("start", "Compiles the development environment", [
    "build:development",
    "connect:dev",
    "watch:src"
  ]);

    grunt.registerTask("build:development", "Compiles the development build", [
    "copy:src",
    <%
        if (stylesheet === "sass") { %> "sass:compile", <%
        } %>
    "copy:tmp"
  ]);

    grunt.registerTask("build:distribution", "Compiles the distribution build", [
    "copy:src",
    <%
        if (stylesheet === "sass") { %> "sass:compile", <%
        } %>
    "uncss:dist",
    "htmlmin:dist",
    "premailer:dist",
    "imagemin:dist",
    "copy:tmp"
  ]);


    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-imagemin");
    grunt.loadNpmTasks("grunt-uncss");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-html-validation");
    grunt.loadNpmTasks("grunt-lint-pattern");
    grunt.loadNpmTasks("grunt-premailer"); <%
    if (stylesheet === "sass") { %>
            grunt.loadNpmTasks("grunt-sass"); <%
    } %>

};
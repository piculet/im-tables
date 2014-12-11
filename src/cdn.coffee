Promise = require 'es6-promises'
_ = require 'underscore'
$ = require 'jquery'

options = require './options'

OPTS =
  server: 'http://cdn.intermine.org'
  tests:
    fontawesome: /font-awesome/
    glyphicons: /bootstrap-icons/
  resources:
    prettify: [
      '/js/google-code-prettify/latest/prettify.js',
      '/js/google-code-prettify/latest/prettify.css'
    ]
    d3: '/js/d3/3.0.6/d3.v3.min.js'
    glyphicons: "/css/bootstrap/2.3.2/css/bootstrap-icons.css"
    fontawesome: "/css/font-awesome/4.x/css/font-awesome.min.css"
    filesaver: '/js/filesaver.js/FileSaver.min.js'

options.set 'CDN', OPTS

asArray = (things) -> [].slice.call(things)

hasStyle = (pattern) ->
  return false unless pattern? # No way to tell, assume not.
  links = asArray document.querySelectorAll 'link[rel="stylesheet"]'
  _.any links, (link) -> pattern.test link.href

loader = (server) -> (resource, resourceRegex) ->
  # scripts will be loaded, but possibly not executed: hang off a bit
  resolution = new Promise (resolve) -> _.delay resolve, 50, true

  if /\.css$/.test resource
    return resolution if hasStyle resourceRegex
    link = $ '<link type="text/css" rel="stylesheet">'
    link.appendTo('head').attr href: server + resource
    return resolution
  else
    fetch = $.ajax
      url: server + resource
      cache: true
      dataType: 'script'
    return fetch.then -> resolution

exports.load = (ident) ->
  {server, tests, resources} = options.get 'CDN'
  conf = resources[ident]
  test = tests[ident]
  load = loader server
  if not conf
    Promise.reject "No resource is configured for #{ ident }"
  else if _.isArray(conf)
    Promise.all (load c for c in conf)
  else
    load conf, test

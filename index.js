var _ = require('lodash');
var async = require('async');
var theWorks = require('the-works');
var compilePathMatcher = require('path_matcher');

var Router = function(schemas,packages) {
	var self = this;
	this.routeTable = [];
	this.packages = packages;
	this.schemas = schemas;

	_.each(this.schemas,function(schema,name){
		self.routeTable.push({
			'matcher':compilePathMatcher(schema),
			'name':name
		});
	});
};

Router.prototype.match = function(reqUrl) {
	
	var self = this;

	return self.routeTable.map(function(route){
		return {
			'params': route.matcher(reqUrl),
			'package': self.packages[route.name]
		}
	})
	.filter(function(val){
		return val.params !== false;
	});
};

//-------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------
//			MEH, should this thing put up errors or something?
//-----------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
var createRouter = function(overlays,routes,callback) {

	var basePackage = theWorks.config.overlay(overlays);
	var builder = theWorks.createBuilder();

	var routeBuilds = {};
	var routeSchemas = {};

	_.each(routes,function(route,name){

		routePackage = theWorks.config.trimout([basePackage,route.plugins]);
		routeSchemas[name] = route.schema;
		routeBuilds[name] = async.apply(builder,routePackage);
	});

	async.parallel(routeBuilds,function(err,routePackages){
		if(err){
			callback(err,null);
		}

		callback(null,new Router(routeSchemas,routePackages));
	});
}

module.exports.createRouter = createRouter;

module.exports.plugin = function(options,callback){
	
	var overlays = options.overlays || [];
	createRouter(options.overlays,options.routes,callback);
};
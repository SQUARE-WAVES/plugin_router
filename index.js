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
			'matches':compilePathMatcher(schema),
			'name':name,
			'schema':schema
		});
	});
};

Router.prototype.match = function(method,path) {
	
	var self = this;

	return self.routeTable.map(function(route){

		var match = (route.schema.method === method) && route.matches(path)

		return {
			'params': match,
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
var createRouter = function(overlays,routes,builderCustomizations,callback) {

	if(typeof(builderCustomizations) === 'function'){
		callback = builderCustomizations;
		builderCustomizations = undefined;
	}

	var basePackage = theWorks.config.overlay(overlays);
	var builder = theWorks.createBuilder(builderCustomizations);

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


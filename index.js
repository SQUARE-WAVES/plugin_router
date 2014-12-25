var compilePathMatcher = require('warpath-matcher');

var Router = function(config) {

	this.routeTable = config.map(function(routeObject){
		return {
			'matches':compilePathMatcher(routeObject.schema),
			'data':routeObject.data
		}
	});
};

Router.prototype.match = function(path) {
	var self = this;
	var matches = [];

	self.routeTable.forEach(function(route){
		var ret = route.matches(path);

		if(ret !== false) {
			matches.push({
				'params':ret,
				'data':route.data
			});
		}
	});

	return matches;
};

//-----------------------------------------------------------------------------
// config here consits of a list of routes with their associated data
// something like [{schema:xxx, data:yyy},...]
//-----------------------------------------------------------------------------

var createRouter = function(config) {
	return new Router(config);
}

var worksConstructor = function(options,cb) {
	var router;
	try{
		router = createRouter(options)
	}
	catch(exc){
		cb(exc,null);
	}

	cb(null,router);
}

module.exports.createRouter = createRouter;
module.exports.works = worksConstructor;


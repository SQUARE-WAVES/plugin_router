module.exports.handler1 = function(options,callback) {
	callback(null,function(){
		return 'it is me, the test handler';
	});
}

module.exports.handler2 = function(options,callback){
	callback(null,function() {
		return options.statement;
	});
}
var assert = require('assert');
var createRouter = require("../index.js").createRouter;

suite('router config',function(){

	test('test router with normal config',function(done){
		
		var config =[
			{
				'schema':{
					'method':'GET',
					'pathDescription':'/route/1/:whatever?',
				},
				'data':"route1!"
			},
			{
				'schema':{
					'method':'GET',
					'pathDescription':'/route/2/:whatever?',
				},
				'data':"route2!"
			}
		];

		var router = createRouter(config);
		assert.equal(router.routeTable.length,2,'this router should have 2 routes');

		var matches1 = router.match('/route/1/eh');
		var matches2 = router.match('/route/2/meh');
		var matches3 = router.match('/dogs');
		var matches4 = router.match('route/1/eh');

		assert.equal(matches1.length,1,'the first test should only match one route');
		assert.equal(matches2.length,1,'the second test should only match one route');
		assert.equal(matches3.length,0,'the third test should match neither route');

		assert.equal(matches1[0].params.whatever,'eh','the first match should have params');
		assert.notEqual(matches1[0].data,undefined,'the first match should have associated data');

		assert.equal(matches2[0].params.whatever,'meh','the second match should have params');
		assert.notEqual(matches2[0].data,undefined,'the second match should have associated data');

		assert.equal(matches4.length,0,'the wrong method should not match');

		done();
	});

	test('test router with ambiguous routes',function(done){
		
		var config = [
			{
				'schema':{
					'method':'GET',
					'pathDescription':'/route/1/cornfish',
				},
				'data':'route1!'
			},
			{
				'schema':{
					'method':'GET',
					'pathDescription':'/route/1/:whatever?',
				},
				'data':'route2!'
			}
		];

		var router = createRouter(config);

		assert.equal(router.routeTable.length,2,'this router should have 2 routes');

		var matches = router.match('/route/1/cornfish');

		assert.equal(matches.length,2,'the first test match both routes');
		var match1 = matches[0];
		var match2 = matches[1];

		assert.equal(match1.params.whatever,undefined,'the first match should not have any params');
		assert.equal(match2.params.whatever,'cornfish','the second match should have params');

		assert.equal()

		done();
	});

	test('test router with no routes',function(done){
		
		var config = [];

		var router = createRouter(config);

		assert.equal(router.routeTable.length,0,'this router should have no routes');

		var matches = router.match('/route/1/cornfish');

		assert.equal(matches.length,0,'nothing should match');
		assert.equal()

		done();

	});
});

suite('perf testing',function(){

	var config = [];
	var routecount = 1000;

	test('routes with no params',function(done){

		var createRoute = function(conf,name){

			conf.push({
				'schema':{
					'method':'GET',
					'pathDescription':'/route/'+name,
				},
				'data':'horsefestival'
			});
		}

		for(var i=0; i<routecount; i++) {
			createRoute(config,'zapp'+i)
		}

		//test using the final route name
		var testName = 'zapp5'

		var router = createRouter(config);

		var lrStart = new Date().valueOf();
		var startTime = process.hrtime();

		var matches = router.match('/route/'+testName);
		var endTime = process.hrtime(startTime);
		var lrEnd = (new Date().valueOf()) - lrStart;

		assert.equal(matches.length,1,'one route should be matched');

		console.log('------------------------------------------------');
		console.log('--------------------------------');
		console.log("time to scan "+routecount+" routes");
		var ns = endTime[0] * 1e9 + endTime[1];

		console.log('benchmark took %d nanoseconds', ns);
		console.log('aka %d us, and %d ms',ns/1000, ns/1000000); 
		console.log('--------------------------------');
		console.log('------------------------------------------------');

		done();
	});
});
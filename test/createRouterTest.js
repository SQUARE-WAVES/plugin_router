var assert = require('assert');
var createRouter = require("../index.js").createRouter;

suite('router config',function(){

	test('test router with normal config',function(done){
		
		var config = {
			'route1':{
				'schema':{
					'method':'GET',
					'path':'/route/1/:whatever?',
				},
				'plugins':{
					'handler':{
						'plugin':'./test/testHandler.js#handler1'
					}
				}
			},
			'route2':{
				'schema':{
					'method':'GET',
					'path':'/route/2/:whatever?',
				},
				'plugins':{
					'handler':{
						'plugin':'./test/testHandler.js#handler2'
					},
					'notes':{
						'value':'hooray'
					}
				}
			}
		};

		createRouter([],config,function(err,router){

			assert.ifError(err,'there should not be an error with this config');

			assert.equal(router.routeTable.length,2,'this router should have 2 routes');

			var matches1 = router.match('/route/1/eh');
			var matches2 = router.match('/route/2/meh');
			var matches3 = router.match('/dogs');
			var matches4 = router.match('route/1/eh');

			assert.equal(matches1.length,1,'the first test should only match one route');
			assert.equal(matches2.length,1,'the second test should only match one route');
			assert.equal(matches3.length,0,'the third test should match neither route');

			assert.equal(matches1[0].params.whatever,'eh','the first match should have params');
			assert.notEqual(matches1[0].package,undefined,'the first match should have a package');

			assert.equal(matches2[0].params.whatever,'meh','the second match should have params');
			assert.notEqual(matches2[0].package,undefined,'the second match should have a package');

			done();
		});
	});

	test('test router with ambiguous routes',function(done){
		
		var config = {
			'route1':{
				'schema':{
					'method':'GET',
					'path':'/route/1/cornfish',
				},
				'plugins':{
					'handler':{
						'plugin':'./test/testHandler.js#handler1'
					}
				}
			},
			'route2':{
				'schema':{
					'method':'GET',
					'path':'/route/1/:whatever?',
				},
				'plugins':{
					'handler':{
						'plugin':'./test/testHandler.js#handler2'
					},
					'notes':{
						'value':'hooray'
					}
				}
			}
		};

		createRouter([],config,function(err,router){

			assert.ifError(err,'there should not be an error with this config');

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
	});

	test('test router with no routes',function(done){
		
		var config = {};

		createRouter([],config,function(err,router){

			assert.ifError(err,'there should not be an error with this config');

			assert.equal(router.routeTable.length,0,'this router should have 2 routes');

			var matches = router.match('/route/1/cornfish');

			assert.equal(matches.length,0,'the first test match both routes');
			assert.equal()

			done();
		});
	});
});
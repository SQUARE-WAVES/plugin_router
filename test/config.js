module.exports.config = {
	'route1':{
		'method':'GET',
		'path':'/route/1/:whatever?',
		'params':{
			'whatever':".*"
		},
		'plugins':{
			'handler':{
				'module':'./test/testHandler.js#handler1'
			}
		}
	},
	'route2':{
		'method':'GET',
		'path':'/route/1/:whatever?',
		'params':{
			'whatever':".*"
		},
		'plugins':{
			'handler':{
				'module':'./test/testHandler.js#handler2'
			},
			'notes':{
				'value':'hooray'
			}
		}
	}
}
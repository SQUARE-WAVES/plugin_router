WARPATH-ROUTER
==============

#(FINAL ROUND of the warpath suite of helpfully named tools)

get on the ROUTE TO VICTORY, when you TURN A SCHEMA INTO A THING YOU CAN USE.

#what does this thing do?

the router is a tool for taking a route configuration and doing something useful with it. It uses the warpath-matcher and the same kind of rules to take a configuration that looks like this

```javascript

var config = [
	{
		"schema":{
			"pathDescription":{
				"path":"/dogs/:breed",
				"params":{
					"breed":{
						"values":["corgi","borzoi","pitbull","dracula hound"]
					}
				}
			}
		},
		"data":function(req,res){
			res.end("PARTY ON")
		}
	},
	//and many more!
	...
]
```

and returns an object like this

```javascript

	var router = createRouter(config);

	router.match("/some/non/existant/route"); //returns empty array

	var coolThing = router.match("/dogs/borzoi");

	//coolThing will be an object that looks like this
	{
		"params":{
			"breed":"borzoi"
		},
		"data":function(req,res){
			res.end("PARTY ON")
		}
	}

```

#what about HTTP methods?

This router was designed to be used with HTTP but it wasn"t designed for that exclusively. It could be used with other protocols which use "/" delimited paths. That means it doesn"t make decisions about how to handle verbs or other HTTP related content. That means it"s up to you to decide how to handle it, and depending on what you are trying to do different approaches might be better. Here are 2 possible ways to handle HTTP methods. There are probably some other good ones that I haven"t thought of.

1. create different routers for each verb and select the router you need before matchign the path.
2. put a handler for all the different supported verbs in the data object and select after you ahve matched.

#what about queries?

this router was not meant to decide on queries, that kind of policy will have to be decided after the route is matched.
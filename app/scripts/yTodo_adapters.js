var ytodo = ytodo || {};
ytodo.Adapters = {};

ytodo.Adapters.Google = (function(){

	var
		// cTodo registered info
		regInfo = {
			clientId : '207999260172.apps.googleusercontent.com',
			apiKey : 'AIzaSyAZOeBh5jP4UnYQyV2cZYjD69hwUIYxK3s',
			scope : 'https://www.googleapis.com/auth/tasks'
		},
		// User specific info
		userInfo = {
			listId : '',
			updated : '',
			localIdTable : {}, // table for matching local Id to Google tasks Id
			remoteIdTable : {} // table for matching Google tasks Id to local Id
		},

		// Global adapter functions
		initialize = function(){
			loadLocalInfo();
			gapi.client.setApiKey(regInfo.apiKey); // Optional : Set Google API key
			gapi.client.load('tasks', 'v1');
			oauth(getList);
		},

		createTask = function(localId, callback){
			//if(userInfo.localIdTable.hasOwnProperty(localId)){ return false;}
			var localTask = ytodo.Data.getTask(localId);
			var request = gapi.client.tasks.tasks.insert({
				tasklist : userInfo.listId,
				resource : convertToGoogleTask(localTask)
			});
			request.execute( function(resp){
				createIdPair(localId, resp.id);
				console.log("created", resp);
			});
		},
		getTask = function(taskId, callback){ },
		updateTask = function(taskId, task, callback){ },
		deleteTask = function(taskId, callback){
			var request = gapi.client.tasks.tasks.delete({
				tasklist: userInfo.listId, task : userInfo.localIdTable[taskId]
			});
			request.execute( function(resp){
				deleteIdPair(taskId);
				console.log("deleted", resp)
			});
		},

		// Local storage functions
		saveLocalInfo = function(){
			if(!Modernizr.localstorage) { return false; }
			localStorage['adapter_info'] = JSON.stringify(userInfo);
		},
		loadLocalInfo = function(){
			if(!Modernizr.localstorage) { return false; }
			if(localStorage.hasOwnProperty('adapter_info')){
				userInfo = JSON.parse(localStorage['adapter_info']);
			}
		},
		createIdPair = function(localId, remoteId){
			userInfo.localIdTable[localId] = remoteId;
			userInfo.remoteIdTable[remoteId] = localId;
			saveLocalInfo();
		},
		deleteIdPair = function(localId){
			var remoteId = userInfo.localIdTable[localId];
			delete userInfo.localIdTable[localId];
			delete userInfo.remoteIdTable[remoteId];
			saveLocalInfo();
		},

		// Adapter authentication functions
		oauth = function(callback){
			gapi.auth.authorize(
				{ 'client_id': regInfo.clientId, 'scope': regInfo.scope },
				function() {
					console.log(gapi.auth.getToken());
					if(callback){ callback();}
				}
			);
		},

		// Other adapter functions
		getList = function(callback){
			var request = gapi.client.tasks.tasklists.list();
			request.execute( function(resp){
				// Check if yTodo List is already existing
				for(var i=0; i<resp.items.length; ++i){
					if(resp.items[i].title === "yTodo List"){
						userInfo.listId = resp.items[i].id;
						break;
					}
				}
				// If yTodo List is not found, then create one
				if(userInfo.listId === ''){
					var request = gapi.client.tasks.tasklists.insert({ resource : { title : 'yTodo List' }});
					request.execute(function(resp){
						userInfo.listId = resp.id;
						importTasks(userInfo.listId);
						//if(callback){ callback(resp);}
					});
				} //else if(callback){ callback();}
				else { importTasks(userInfo.listId); }
			});

		},
		importTasks = function(listId){
			var request = gapi.client.tasks.tasks.list({ 'tasklist': listId });
			request.execute( function(resp){
				console.log(resp);
				for(var i=0; i<resp.items.length; ++i){
					// check if the task item is already existing
					if(userInfo.remoteIdTable.hasOwnProperty(resp.items[i].id)){ continue; }
					// else create a local copy
					var createdId = ytodo.Data.createTask( convertToLocalTask(resp.items[i]));
					createIdPair(createdId, resp.items[i].id);
					ytodo.UI.insertTask(ytodo.Data.getTask(createdId));
				}
			});
		},
		convertToLocalTask = function(googleTaskItem){
			var metaObject = JSON.parse(googleTaskItem.notes);
			return (new ytodo.Type.taskItem({
				title : googleTaskItem.title,
				status : googleTaskItem.status,
				priority : metaObject.priority
			}));
		},
		convertToGoogleTask = function(localTask){
			var metaObject = {
				priority : localTask.priority
			};
			return {
				title : localTask.title,
				notes : JSON.stringify(metaObject)
			};
		};

	return {
		initialize : initialize,
		createTask : createTask,
		deleteTask : deleteTask
	};
})();

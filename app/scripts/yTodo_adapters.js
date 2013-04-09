var ytodo = ytodo || {};
ytodo.Adapters = {};

ytodo.Adapters.Google = (function(){

	var
		connected = false,

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
		isConnected = function(){ return connected;	},
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
		updateTask = function(taskId, partialTask, callback){
			var request = gapi.client.tasks.tasks.patch({
				tasklist : userInfo.listId, task : userInfo.localIdTable[taskId],
				resource : convertToGoogleTask(partialTask)
			});
			request.execute( function(resp){
				console.log("patched", resp);
			});
		},
		deleteTask = function(localId, callback){
			var request = gapi.client.tasks.tasks.delete({
				tasklist: userInfo.listId, task : userInfo.localIdTable[localId]
			});
			request.execute( function(resp){
				deleteIdPair(localId);
				console.log("deleted", resp);
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
					connected = true;
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
			var localTaskItem = new ytodo.Type.taskItem({
				title : googleTaskItem.title,
				status : googleTaskItem.status,
				priority : metaObject.priority,
				category : metaObject.category,
				isSynced : true
			});
			if(metaObject.links){ localTaskItem.links = metaObject.links; }
			if(metaObject.tags){ localTaskItem.tags = metaObject.tags; }
			if(metaObject.note){ localTaskItem.note = metaObject.note; }
			return localTaskItem;
		},
		convertToGoogleTask = function(localTaskItem){
			var metaObject = {}, googleTaskItem = {}, hasMeta = false;;
			for(var key in localTaskItem){
				if(!localTaskItem.hasOwnProperty(key)) { continue; }
				if(['title', 'status'].indexOf(key) !== -1){
					googleTaskItem[key] = localTaskItem[key];
				} else if(['priority', 'category', 'links', 'tags', 'notes'].indexOf(key) !== -1){
					metaObject[key] = localTaskItem[key];
					hasMeta = true;
				}
			}
			if(hasMeta) { googleTaskItem.notes = JSON.stringify(metaObject); }
			return googleTaskItem;
		};

	return {
		initialize: initialize,
		createTask: createTask,
		deleteTask: deleteTask,
		isConnected: isConnected
	};

})();

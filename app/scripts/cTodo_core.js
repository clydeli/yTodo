var cTodo = cTodo || {};

cTodo.Core = {
	initialize : function(){},
	sync : function(taskID){
		if(taskID === undefined){
			// Sync all tasks
		} else {
			// Sync specified task
			// check version info on server -> replace(synced) or merge(not synced) with local version -> update task
		}
	}
};
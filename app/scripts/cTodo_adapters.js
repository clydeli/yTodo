var cTodo = cTodo || {};
cTodo.Adapters = {};

cTodo.Adapters.Google = {
	// Adapter variables
	listId : "",
	updated : "",
	idTable : {}, // A table for matching local Id to Google tasks Id

	// Adapter functions
	createTask : function(task, callback){

	},
	getTask : function(taskId, callback){

	},
	updateTask : function(taskId, task, callback){

	},
	deleteTask : function(taskId, callback){
		// Make attrtibute "deleted" as true
	}
}

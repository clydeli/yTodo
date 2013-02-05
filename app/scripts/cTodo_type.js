var cTodo = cTodo || {};
cTodo.Type = {};

cTodo.Type.taskItem = function(task){
	this.id = task.id || ""; 
	this.title = task.title || "";
	this.status = task.status || "needs Action";
	this.links = task.links || [];
	this.tags = task.tags || [];
	this.due = task.due || ""; 
	this.note = task.note || "";
	this.importance = task.importance || "low";
	this.updated = task.updated || "";
	this.isSynced = task.isSynced || false;
};

cTodo.Type.taskItem.prototype = {
	mergeWith : function(task){

	}

};
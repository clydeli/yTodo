var ytodo = ytodo || {};
ytodo.Type = {};

// Define the Type "taskItem"
ytodo.Type.taskItem = function(task){
	this.id = task.id || '';
	this.title = task.title || '';
	this.status = task.status || 'needsAction';
	this.updated = task.updated || (new Date());
	this.isSynced = task.isSynced || false;
	this.category = task.category || 'active'; // Active, Backlog, Regular
	this.priority = task.priority || 0;
	// Optional content
	if(task.links){ this.links = task.links || []; } // Mail, Map, Regular links
	if(task.tags){ this.tags = task.tags || []; }
	if(task.due){ this.due = task.due || (new Date()); }
	if(task.note){ this.note = task.note || ''; }
};

ytodo.Type.taskItem.prototype = {
	mergeWith : function(task){
		if(!this.isSynced){
			// Temporary merge handler based on updated time
			//if(task.updated.gettime() > this.updated.gettime()){ this = task; }
		}
	}
};

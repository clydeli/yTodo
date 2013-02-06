var cTodo = cTodo || {};

cTodo.UI = {
	// UI functions
	initialize : function(){
		console.log("UI initializing...");
		// Read task data and append to html
		var key;
		for(key in cTodo.Data.localTasks){
			$("#todoList").append( "<li>"+cTodo.Data.localTasks[key].title+"</li>");
		}
		this.eventBinding();
	},
	eventBinding : function(){
		// Binding UI events
	}
};

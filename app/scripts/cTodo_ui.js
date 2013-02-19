var cTodo = cTodo || {};

cTodo.UI = {
	// UI functions
	initialize : function(){
		console.log("UI initializing...");
		// Read task data and append to html
		for(var key in cTodo.Data.localTasks){
			this.insertTask(cTodo.Data.localTasks[key].category || "active", cTodo.Data.localTasks[key]);
		}

		this.eventBinding();
	},
	eventBinding : function(){
		// Binding UI events
		var that = this;
		$("#newTask").on("click", ".trigger", function(){
			// Temporary UI Tests
			$("#newTask").html("<div><input type='text'></div>").css("width", "256px");
			$("#newTask input").focus();
		});
		$("#newTask").on("keyup", "input", function(e){
			if(e.keyCode == 13){
				var newTask = new cTodo.Type.taskItem({
					title : $("#newTask input").val() ,
					category : "active"
				});
				var createdId = cTodo.Data.createTask(newTask)
				that.insertTask("active", cTodo.Data.getTask(createdId));
				// Temporary UI Tests
				$("#newTask").html('<div class="trigger"> + </div>').css("width", "20px");
			}
		});
		$("#todoList_active").on("click", ".closeButton", function(){
			// Temporary UI Tests
			if($(this).parent().hasClass("completed")){
				var taskId = $(this).parent().parent().attr("data-taskId");
				cTodo.Data.deleteTask(taskId);
				$(this).parent().parent().css("width", "0").fadeOut();
			} else { $(this).parent().addClass("completed"); }
		});


	},

	// Inner functions
	insertTask : function(category, task){
		var taskHTML = '<li data-taskId="'+task.id+'"><div>'+task.title+'</div><div class="closeButton">x</div></li>';
		switch(category){
			case "active" :
				$(taskHTML).insertBefore($("#newTask"));
				break;
		}
	}
};

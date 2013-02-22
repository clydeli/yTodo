var cTodo = cTodo || {};

cTodo.UI = {
	// UI functions
	initialize : function(){
		console.log('UI initializing...');
		// Read task data and append to html
		for(var key in cTodo.Data.localTasks){
			this.insertTask(cTodo.Data.localTasks[key]);
		}

		this.eventBinding();
	},
	eventBinding : function(){
		var that = this;
		// Binding UI events
		$('.newTask').on('click', '.addButton', function(){
			$('.newTask').addClass('expandedNewTask');
			$('.newTask input').focus();
		});
		$('.newTask').on('keyup', 'input', function(e){
			if(e.keyCode === 13){
				var newTask = new cTodo.Type.taskItem({
					title : $('.newTask input').val()
				});
				var createdId = cTodo.Data.createTask(newTask);
				that.insertTask(cTodo.Data.getTask(createdId));
				$('.newTask').removeClass('expandedNewTask');
			}
		});

		$('#todoList_active').on('click', '.closeButton', function(){
			// Temporary UI Tests
			if($(this).parent().hasClass('newTask')){
				$(this).parent().removeClass('expandedNewTask');
			}
			else if($(this).parent().find('.taskBody').hasClass('completed')){
				var taskId = $(this).parent().attr('data-taskId');
				cTodo.Data.deleteTask(taskId);
				$(this).parent().css('width', '0').fadeOut();
			} else { $(this).parent().find('.taskBody').addClass('completed'); }
		});


	},

	// Inner functions
	insertTask : function(task){
		var taskHTML = '<li data-taskId="'+task.id+'"><div class="taskBody">'+task.title+'</div><div class="closeButton">x</div></li>';
        switch(task.category){
			case 'active' :
				$(taskHTML).insertBefore($('.newTask'));
                $('#todoList_active li[data-taskId="'+task.id+'"]').css('-webkit-transform','rotate('+(Math.random()*2-1)+'deg)');
				break;
		}
	}
};

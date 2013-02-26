var cTodo = cTodo || {};

cTodo.UI = {
	// UI functions
	initialize : function(){
		console.log('UI initializing...');
		// Read task data and append to html
		for(var key in cTodo.Data.localTasks){
			this.insertTask(cTodo.Data.localTasks[key]);
		}

		$('#todoList_active').resizable({ handles: 's' });

		this.eventBinding();
	},
	eventBinding : function(){
		var that = this; // reserve the this pointer to that...
		// Binding UI events
		$('.newTask').on('click', '.addButton', function(){
			$('.newTask').addClass('expandedNewTask');
			setTimeout(function(){$('.newTask input')[0].focus();}) // trick to get the input focused
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
			var taskContainer = $(this).parent();
			if(taskContainer.hasClass('newTask')){
				taskContainer.removeClass('expandedNewTask');
			}
			else if(taskContainer.find('.taskBody').hasClass('completed')){
				var taskId = taskContainer.attr('data-taskId');
				cTodo.Data.deleteTask(taskId);
				taskContainer.css('width', '0').fadeOut();
			} else { taskContainer.find('.taskBody').addClass('completed'); }
		});

		// Menu button actions
		$('#loginButton').click( function(){ cTodo.Data.remoteAdapter.initialize();	});
		$('#importButton').click( function(){
			cTodo.Data.remoteAdapter.getLists( function(resp){
				for(var i=0; i<resp.items.length; ++i){
					cTodo.Data.remoteAdapter.importTasks(resp.items[i].id);
				}
			});
		});

	},

	// Inner functions
	insertTask : function(task){
		var taskHTML = '<li data-taskId="'+task.id+'"><div class="taskBody">'+task.title+'</div><div class="closeButton">x</div></li>';
		var rotateDeg = (Math.random()*2-1).toString();
		switch(task.category){
			case 'active' :
				$(taskHTML).insertBefore($('.newTask'));
				$('#todoList_active li[data-taskId="'+task.id+'"]').css({
					'-webkit-transform' : 'rotate('+rotateDeg+'deg)',
					'-moz-transform' : 'rotate('+rotateDeg+'deg)'
				});
				break;
		}
	}
};

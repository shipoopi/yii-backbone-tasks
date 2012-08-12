jQuery(function($) {

	var Task = Backbone.Model.extend({

		defaults: {
			id: null,
			title: '',
			done: false,
			create_time: Math.round(+new Date() / 1000),
			update_time: Math.round(+new Date() / 1000)
		},

		toggleDone: function() {
			this.save({
				done: this.get('done') > 0 ? 0 : 1
			});
		}

	});

	var TaskBook = Backbone.Collection.extend({

		model: Task,

		url: '/task',

		finished: function() {
			return this.filter(function(task){ return task.get('done') > 0; });
		},

		remaining: function() {
			return this.filter(function(task){ return task.get('done') == 0; });
		}

	});

	var taskBook = new TaskBook;

	var TaskView = Backbone.View.extend({

		tagName: 'tr',

		className: 'task',

		template: _.template($('#task-template').html()),

		events: {
			'click .task-action-toggle-done': 'toggleDone',
			'click .task-action-delete': 'delete'
		},

		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},

		render: function() {
			$(this.el).html(this.template(this.model.toJSON()));
			this.setTitle();
			this.setDone();
			this.setCreated();
			return this;
		},

		setTitle: function() {
			var title = this.model.get('title');
			this.$('.task-title').text(title);
		},

		setDone: function() {
			var done = this.model.get('done');
			this.$('.task-done').text(done > 0 ? 'Yes' : 'No');
		},

		setCreated: function() {
			var create_time = this.model.get('create_time');
			var dt = new Date(create_time * 1000);
			this.$('.task-created').text(
				dt.getDay() + '.' + dt.getMonth() + '.' + dt.getFullYear() + ', ' + dt.getHours() + ':' + dt.getMinutes()
			);
		},

		remove: function() {
			$(this.el).remove();
		},

		toggleDone: function(e) {
			e.preventDefault();
			this.model.toggleDone();
		},

		delete: function(e) {
			e.preventDefault();
			this.model.destroy();
		}

	});

	var AppView = Backbone.View.extend({

		el: $('#tasks'),

		events: {
			'click .task-action-create': 'createTask'
		},

		initialize: function() {
			this.titleInput = this.$('.task-form-title');
			this.doneCheckbox = this.$('.task-form-done');

			taskBook.bind('add', this.addOneTask, this);
			taskBook.bind('reset', this.addAllTasks, this);

			taskBook.fetch();
		},

		render: function(data) {
			this.$(".task-list").html('');
			_.each(data, function(task) { this.addOneTask(task); }, this);
			return this;
		},

		addOneTask: function(task) {
			var taskView = new TaskView({model: task});
			this.$('.task-list').append(taskView.render().el);
		},

		addAllTasks: function() {
			taskBook.each(this.addOneTask);
		},

		createTask: function(e) {
			e.preventDefault();

			var title = this.titleInput.val(),
				done = this.doneCheckbox.prop('checked') ? 1 : 0;

			taskBook.create({title: title, done: done});

			this.titleInput.val('');
			this.doneCheckbox.prop('checked', false);
		}

	});

	var appView = new AppView;

	var TaskRouter = Backbone.Router.extend({

		routes: {
			'finished': 'showFinished',
			'remaining': 'showRemaining',
			'*hash': 'defaultRoute'
		},

		showFinished: function() {
			appView.render(taskBook.finished());
		},

		showRemaining: function() {
			appView.render(taskBook.remaining());
		},

		defaultRoute: function(hash) {
			appView.render(taskBook.models);
		}

	});

	var taskRouter = new TaskRouter;
	Backbone.history.start();

});

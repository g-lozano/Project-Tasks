/**

add new functions:
  edit project name
 */

angular.module('todo', ['ionic'])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle, //initiate title
        tasks: [] //empty tasks
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

  // Edit task title
  $scope.editTask = function(index) {
    var sure = confirm('Edit task?');
    if (sure) {
      var new_task = prompt('Enter new task: ');
      $scope.projects[Projects.getLastActiveIndex()].tasks[index].title = new_task;
      Projects.save($scope.projects);
    }
  };

  // Delete a project
  $scope.deleteProject = function(index) {
    var sure = confirm('Are you sure you want to delete?');
    if(sure) {
      $scope.projects.splice(index, 1);
      Projects.save($scope.projects);
      //$scope.activeProject = $scope.projects[0];
      $scope.selectProject(projects[0], 0);
      $scope.toggleProjects();
    }
  };

  // Delete a task in a project
  $scope.deleteTask = function(index) {
    var sure = confirm('Are you sure you want to delete?');
    if(sure) {
      //$scope.projects.splice(Projects.getLastActiveIndex(), 1);
      $scope.projects[Projects.getLastActiveIndex()].tasks.splice(index, 1);
      Projects.save($scope.projects);
      //clear tasks
      //$scope.activeProject = $scope.projects[0];
      $scope.selectProject(projects[0], 0);
      //$scope.toggleProjects();
    }
  };

  // A utility function for creating a new project
  // with the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  };

  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = function() {
    var projectTitle = prompt('Project name');
    if(projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeTaskModal = function() {
    $scope.taskModal.hide();
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.projects.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  }, 1000);

})


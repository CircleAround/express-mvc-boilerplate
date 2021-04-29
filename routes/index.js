const { Route } = require('../lib/route');
const forceLogin = require('../app/middlewares/force_login');
const forceAdmin = require('../app/middlewares/force_admin');

const route = new Route();

// function style
route.get('/', 'top_controller@index');

// single style
route.get('/user/edit', forceLogin, 'users_controller@edit');
route.put('/user', forceLogin, 'users_controller@update');

// resource style
route.resource('examples', 'examples_controller');

// /adminのURL階層の作成。ログインチェック、管理者チェックが有効。
const adminRoute = route.sub('/admin', forceLogin, forceAdmin);
adminRoute.resource('users', 'admin/users_controller');

{
  // for manager
  const managerRoute = route.sub('/manager', forceLogin);  
  managerRoute.resource('teams', 'manager/teams_controller');
  
  const teamRoute = managerRoute.sub('/teams/:team');  
  teamRoute.resource('tasks', { controller: 'manager/tasks_controller', only: ['create', 'store'] });
  teamRoute.resource('members', { controller: 'manager/members_controller', only: ['index', 'store', 'destroy'] });
}

{
  // for all  
  route.resource('tasks', { controller: 'tasks_controller', only: ['index', 'show', 'edit', 'update', 'destroy'] });
  route.put('/tasks/:task/archived', 'tasks_controller@archive');

  const taskRoute = route.sub('/tasks/:task');
  taskRoute.resource('comments', { controller: 'comments_controller', only: ['store', 'destroy'] });
}

module.exports = route.router;

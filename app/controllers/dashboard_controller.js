const Controller = require('./controller');
const models = require('../models');

class DashboardController extends Controller {
  // GET /
  async index(req, res) {
    if(req.isAuthenticated()) {
      const tasks = await models.Task.findAll({ where: { assigneeId: req.user.id }, include: ['team', 'assignee'] });
      const members = await models.Member.findAll( { where: { userId: req.user.id }, include: 'team' });
      return res.render('index', { user: req.user, tasks, members });
    }

    return res.render('index');
  }

}

module.exports = DashboardController;
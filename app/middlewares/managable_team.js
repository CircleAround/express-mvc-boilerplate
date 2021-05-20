const models = require('../models');

module.exports = async function managableTeam(req, res, next) {
  const user = req.user;

  const team = await models.Team.findByPk(req.params.team);
  if (!team) {
    return next(new Error('team not found'));
  }

  if (!await team.isManager(user)) {
    await req.flash('alert', 'アクセスできません');
    res.redirect('/');
  }

  req.team = team;
  return next();
};
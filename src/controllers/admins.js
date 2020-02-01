const { AdminService } = require('../services/Admin');

const list = (req, res, next) => {
  const adminService = new AdminService();
  adminService
    .list()
    .then(admins => {
      res.json({
        data: admins,
      });
    })
    .catch(next);
};

const details = (req, res, next) => {
  const adminService = new AdminService();
  const id = req.params.id;

  adminService
    .details(id)
    .then(admin => {
      res.json({
        data: admin,
      });
    })
    .catch(next);
};

const add = (req, res, next) => {
  const adminService = new AdminService();
  adminService
    .add(req.body.data)
    .then(() => {
      res.json({
        data: {},
      });
    })
    .catch(next);
};

const edit = (req, res, next) => {
  const adminService = new AdminService();
  adminService
    .edit(req.params.id, req.body.data)
    .then(() => {
      res.json({
        data: {},
      });
    })
    .catch(next);
};

const remove = (req, res, next) => {
  const adminService = new AdminService();
  adminService
    .remove(req.params.id)
    .then(() => {
      res.json({
        data: {},
      });
    })
    .catch(next);
};

module.exports = { list, details, add, edit, remove };

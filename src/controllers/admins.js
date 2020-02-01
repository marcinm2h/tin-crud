const { AdminService } = require('../services/Admin');

const list = (req, res) => {
  const adminService = new AdminService();
  adminService.list().then(admins => {
    res.json({
      data: admins,
    });
  });
};

const details = (req, res) => {
  const adminService = new AdminService();
  const id = req.params.id;

  adminService.details(id).then(admin => {
    res.json({
      data: admin,
    });
  });
};

const add = (req, res) => {
  const adminService = new AdminService();
  adminService.add(req.body.data).then(() => {
    res.json({
      data: {},
    });
  });
};

const edit = (req, res) => {
  const adminService = new AdminService();
  adminService.edit(req.params.id, req.body.data).then(() => {
    res.json({
      data: {},
    });
  });
};

const remove = (req, res) => {
  const adminService = new AdminService();
  adminService.remove(req.params.id).then(() => {
    res.json({
      data: {},
    });
  });
};

module.exports = { list, details, add, edit, remove };

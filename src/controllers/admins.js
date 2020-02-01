const { Admin } = require('../models/Admin');
const { AdminRepository } = require('../services/repositories/memory/Admin');

const { DbService } = require('../services/Database');

const list = (req, res) => {
  const db = new DbService();
  db.serialize(async () => {
    const admins = await db.list('Admin');
    res.json({
      data: { admins },
    });
  });

  db.close();
  // const adminRepository = new AdminRepository();
  // const admins = adminRepository.list();

  // return res.json({
  //   data: admins,
  // });
};

const details = (req, res) => {
  const adminRepository = new AdminRepository();
  const admin = adminRepository.find(req.params.id);
  adminRepository.save();

  return res.json({
    data: admin,
  });
};

const add = (req, res) => {
  const adminRepository = new AdminRepository();
  const admin = new Admin(req.body.data);
  adminRepository.add(admin);
  adminRepository.save();

  return res.json({
    data: admin,
  });
};

const edit = (req, res) => {
  const adminRepository = new AdminRepository();
  adminRepository.edit(req.params.id, req.body.data);
  adminRepository.save();

  return res.json({
    data: {},
  });
};

const remove = (req, res) => {
  const adminRepository = new AdminRepository();
  adminRepository.remove(req.params.id);
  adminRepository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove };

#!/usr/bin/env node
const fs = require('fs');

const render = ({ name, namePascal, namePlural, namePascalPlural }) => `
const { ${namePascal} } = require('../models/${namePascal}');
const { ${namePascal}Repository } = require('../repositories/memory/${namePascal}');

const list = (req, res) => {
  const ${name}Repository = new ${namePascal}Repository();
  const ${namePlural} = ${name}Repository.list();
  ${name}Repository.save();

  return res.json({
    data: ${namePlural},
  });
};

const details = (req, res) => {
  const ${name}Repository = new ${namePascal}Repository();
  const ${name} = ${name}Repository.details(req.params.id);
  ${name}Repository.save();

  return res.json({
    data: ${name},
  });
};

const add = (req, res) => {
  const ${name}Repository = new ${namePascal}Repository();
  // FIXME: validate req.body.data
  const ${name} = new ${namePascal}(req.body.data);
  ${name}Repository.add(${name});
  ${name}Repository.save();

  return res.json({
    data: ${name},
  });
};

const edit = (req, res) => {
  const ${name}Repository = new ${namePascal}Repository();
  ${name}Repository.edit(req.params.id, req.body.data);
  ${name}Repository.save();

  return res.json({
    data: {},
  });
};

const remove = (req, res) => {
  const ${name}Repository = new ${namePascal}Repository();
  ${name}Repository.remove(req.params.id);
  ${name}Repository.save();

  return res.json({
    data: {},
  });
};

module.exports = { list, details, add, edit, remove };`;

const [nameArg, ...args] = process.argv.slice(2);
if (!nameArg) {
  throw Error('Argument - name - required');
}

const name = nameArg.trim().toLowerCase();
const namePascal = (() => {
  const [first, ...rest] = name;
  return first.toUpperCase().concat(rest.join(''));
})(); // Admin
const namePlural = `${name}s`; // admins
const namePascalPlural = `${namePascal}s`; // Admins
const path = `./src/controllers/${namePlural}.js`;

console.log(`Generating ${path}`);

fs.writeFile(
  path,
  render({ name, namePascal, namePlural, namePascalPlural }),
  err => {
    if (err) {
      return console.log(err);
    }
    console.log(`${name} controller generated!`);
  },
);

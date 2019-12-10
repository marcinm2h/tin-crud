#!/usr/bin/env node
const fs = require('fs');

const render = ({ name, namePascal, namePlural, namePascalPlural }) => `
const { Router } = require('express');
const {
  list,
  details,
  add,
  edit,
  remove,
} = require('../../controllers/${namePlural}');
const { auth } = require('../auth');

const router = Router();

router.get('/${namePlural}', auth.required, list);

router.get('/${namePlural}/:id', auth.required, details);

router.post('/${namePlural}', auth.required, add);

router.put('/${namePlural}/:id', auth.required, edit);

router.delete('/${namePlural}/:id', auth.required, remove);

module.exports = { ${namePlural}: router };`;

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

const path = `./src/routes/api/${namePlural}.js`;

console.log(`Generating ${path}`);

fs.writeFile(
  path,
  render({ name, namePascal, namePlural, namePascalPlural }),
  err => {
    if (err) {
      return console.log(err);
    }
    console.log(`${name} route generated!`);
  },
);

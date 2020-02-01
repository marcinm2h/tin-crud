#!/usr/bin/env node
const fs = require('fs');
const [argName, ...args] = process.argv.slice(2);
if (!argName) {
  throw Error('Argument - name - required');
}

const render = ({ name, namePascal, namePlural, namePascalPlural }) => `
const { Repository } = require('./');

class ${namePascal}Repository extends Repository {}

module.exports = { ${namePascal}Repository };
`;
const name = argName.trim().toLowerCase();
const namePascal = (() => {
  const [first, ...rest] = name;
  return first.toUpperCase().concat(rest.join(''));
})(); // Admin
const namePlural = `${name}s`; // admins
const namePascalPlural = `${namePascal}s`; // Admins
const path = `./src/services/repositories/memory/${namePascal}.js`;

console.log(`Generating ${path}`);

fs.writeFile(
  path,
  render({ name, namePascal, namePlural, namePascalPlural }),
  err => {
    if (err) {
      return console.log(err);
    }
    console.log(`${name} repository generated!`);
  },
);

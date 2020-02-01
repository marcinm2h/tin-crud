let allInstances = {};

const errors = {
  DATA_NOT_FOUND: () => `Nie znaleziono danych.`,
};

class DataNotFoundError extends Error {}

class Repository {
  get name() {
    return this.constructor.name;
  }
  get instances() {
    if (!allInstances[this.name]) {
      // TODO: add tests
      allInstances[this.name] = [];
    }

    return allInstances[this.name];
  }

  set instances(val) {
    if (!allInstances[this.name]) {
      // TODO: add tests
      allInstances[this.name] = [];
    }

    allInstances[this.name] = val;
  }

  list = () => [...this.instances];

  find(id) {
    const instance = this.instances.find(instance => instance.id === id);
    if (!instance) {
      throw new DataNotFoundError(errors.DATA_NOT_FOUND());
    }
    return { ...instance };
  }

  add = instance => this.instances.push(instance);

  edit = (id, newData) => {
    const instance = this.instances.find(instance => instance.id === id);
    if (!instance) {
      throw new DataNotFoundError(errors.DATA_NOT_FOUND());
    }
    return Object.assign(instance, newData);
  };

  remove = id => {
    const exist = Boolean(this.instances.find(instance => instance.id === id));
    if (!exist) {
      throw new DataNotFoundError(errors.DATA_NOT_FOUND());
    }
    this.instances = this.instances.filter(instance => instance.id !== id);
  };

  save = () => {};
}

module.exports = { Repository, DataNotFoundError };

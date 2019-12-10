let allInstances = {};

class DataNotFoundError extends Error {}

class Repository {
  get instances() {
    if (!allInstances[this.constructor.name]) {
      // TODO: add tests
      allInstances[this.constructor.name] = [];
    }

    return allInstances[this.constructor.name];
  }

  set instances(val) {
    if (!allInstances[this.constructor.name]) {
      // TODO: add tests
      allInstances[this.constructor.name] = [];
    }

    allInstances[this.constructor.name] = val;
  }

  list = () => [...this.instances];

  details = id => {
    const instance = this.instances.find(instance => instance.id === id);
    if (!instance) {
      throw DataNotFoundError();
    }
    return { ...instance };
  };

  add = instance => this.instances.push(instance);

  edit = (id, newData) => {
    const instance = this.instances.find(instance => instance.id === id);
    if (!instance) {
      throw DataNotFoundError();
    }
    Object.assign(instance, newData);
  };

  remove = id => {
    const exist = Boolean(this.instances.find(instance => instance.id === id));
    if (!exist) {
      throw DataNotFoundError();
    }
    this.instances = this.instances.filter(instance => instance.id !== id);
  };

  save = () => {};
}

module.exports = { Repository, DataNotFoundError };

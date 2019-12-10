let instances = [];

class DataNotFoundError extends Error {}

class Repository {
  list = () => [...instances];

  details = id => {
    const instance = instances.find(instance => instance.id === id);
    if (!instance) {
      throw DataNotFoundError();
    }
    return { ...instance };
  };

  add = instance => instances.push(instance);

  edit = (id, newData) => {
    const instance = instances.find(instance => instance.id === id);
    if (!instance) {
      throw DataNotFoundError();
    }
    Object.assign(instance, newData);
  };

  remove = id => {
    const exist = Boolean(instances.find(instance => instance.id === id));
    if (!exist) {
      throw DataNotFoundError();
    }
    instances = instances.filter(instance => instance.id !== id);
  };

  save = () => {};
}

module.exports = { Repository, DataNotFoundError };

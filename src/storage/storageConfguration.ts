import FileStorage from "./fs/fsStorage";
import MysqlStorage from "./mysql/mysqlStorage";

let configuration: { [x: string]: any } = {};
let Module: FileStorage | MysqlStorage;

const moduleHandler = {
  setConfig: (key: string, value: 'fs' | 'mysql') => {
    console.log('Service set to: ', value);

    // Crear instancia del módulo de almacenamiento basado en la configuración
    switch (value) {
      case 'fs':
        Module = new FileStorage();
        break;
      case 'mysql':
        Module = new MysqlStorage();
        break;
      default:
        Module = new FileStorage();
        break;
    }

    configuration[key] = value;
  },
  getConfig: () => configuration,
  getModule: () => Module,
};

export {
  moduleHandler
}
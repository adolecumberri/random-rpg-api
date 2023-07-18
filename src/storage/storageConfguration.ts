import FileStorage from "./fs/fsStorage";
import MysqlStorage from "./mysql/mysqlStorage";

let configuration: { [x: string]: any } = {};
let Module: FileStorage | MysqlStorage;

const moduleHandler = {
  setConfig: (key: string, value: any) => {
    console.log('Service set to: ', value);

    // Crear instancia del módulo de almacenamiento basado en la configuración
    if (configuration.service === 'mysql') {
      Module = new MysqlStorage();
    } else {
      Module = new FileStorage();
    }

    configuration[key] = value;
  },
  getConfig: () => configuration,
  getModule: () => Module,
};

export {
  moduleHandler
}
let configuration: {[x:string]: any} = {};

const configHandler = {
  setConfig: (key: string, value: any) => {
    configuration[key] = value;
  },
  getConfig: () => configuration,
};

export {
    configuration,
    configHandler
}
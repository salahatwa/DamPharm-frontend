declare const require: any;
const { name, description, version } = require('../../package.json');

export const environment = {
  production: false,
  api: 'http://localhost:9090/api',
  unauth_api:'http://localhost:8080/unauth',
  name,
  description,
  version
};

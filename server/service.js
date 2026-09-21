let Service = require('node-windows').Service;

let svc = new Service({
  name:'MPS Documentaire',
  description: 'Plateforme de gestion documents qualité',
  /*GPAO*/
  script: 'D:\\gestiondocumentaire\\server\\app.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

svc.on('install', function() {
  svc.start();
});

svc.install();

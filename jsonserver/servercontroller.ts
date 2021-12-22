var nodemon = require('nodemon');

nodemon({
    script: './server.ts',
    ext: 'ts json' // watchin extension
})

nodemon.on('start', function() {
    console.log('Nodemon monitors json server files');
}).on('quit', function() {
    console.log('Nodemon monitors leave');
}).on('restart', function(files:any) {
    console.log('Nodemon restarts the json server due to ', files);
})
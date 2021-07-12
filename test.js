downloadFile(file_id) {
    return new Promise((resolve,reject) => {
        var mongoose = require('mongoose');
    var Grid = require('gridfs-stream');
    var fs = require('fs');

    mongoose.connect(config.db, {useNewUrlParser: true},).catch(e => console.log(e));
    var conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);
    console.log('downloadfile', file_id);
    var read_stream = gfs.createReadStream({_id: file_id});
    let file = [];
    read_stream.on('data', function (chunk) {
        file.push(chunk);
    });
    read_stream.on('error', e => {
        reject(e);
    });
    return read_stream.on('end', function () {
        console.log('file', file); // This logs the file buffer
        resolve(file);
    });
 });
}


var https = require('https');
var http = require('http');

var AWS = require('aws-sdk');
var awsConfig = require('../config.json');
AWS.config.loadFromPath('./config.json');

var s3 = new AWS.S3({apiVersion: '2006-03-01'});

var bucketName = awsConfig.bucketName


var uploadParams = {Bucket: bucketName, Key: '', Body: '', ACL: 'public-read'};


/**
 * uploadLocalFile
 * @param {String} file -- path of localFile
 * @return {String} -- download link
 */
var _uploadLocalFile = function(file){
    return new Promise(function(resolve, reject){
        var fs = require('fs');
        var fileStream = fs.createReadStream(file);
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;

        var path = require('path');

        uploadParams.Key = path.basename(file);

        s3.upload (uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err)
            } if (data) {
                console.log("Upload Success", data.Location);
                resolve(data.Location)
            }
        });
    })
}


function setHttpRequest(url) {
    if(isHttps(url) == 1) 
        return https
    else if(isHttps(url) == 0) 
        return http
}

module.exports = {
    uploadLocalFile : _uploadLocalFile
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbURI = 'postgres://muahlfgukpqstc:50ab78c74334dc60a2ca58a8247fd94eefa71d1a0a046c271c267bb7ba263f29@ec2-46-137-156-205.eu-west-1.compute.amazonaws.com:5432/dc01e2b27bi803';
exports.dbDatabase = 'dc01e2b27bi803';
exports.dbUsername = 'muahlfgukpqstc';
exports.dbPassword = '50ab78c74334dc60a2ca58a8247fd94eefa71d1a0a046c271c267bb7ba263f29';
exports.dbHost = 'ec2-46-137-156-205.eu-west-1.compute.amazonaws.com';
exports.dbDialect = 'postgres';
exports.poolConfigs = {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
};

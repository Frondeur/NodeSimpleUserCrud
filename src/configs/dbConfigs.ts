export const dbURI =
  'postgres://muahlfgukpqstc:50ab78c74334dc60a2ca58a8247fd94eefa71d1a0a046c271c267bb7ba263f29@ec2-46-137-156-205.eu-west-1.compute.amazonaws.com:5432/dc01e2b27bi803';

export const dbDatabase = 'dc01e2b27bi803';
export const dbUsername = 'muahlfgukpqstc';
export const dbPassword =
  '50ab78c74334dc60a2ca58a8247fd94eefa71d1a0a046c271c267bb7ba263f29';
export const dbHost = 'ec2-46-137-156-205.eu-west-1.compute.amazonaws.com';
export const dbDialect = 'postgres';
export const poolConfigs = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000,
};

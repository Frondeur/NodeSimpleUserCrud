import express from 'express';

const routerOptions: express.RouterOptions = {
  caseSensitive: true,
  strict: true,
  mergeParams: false,
};

const configs = {
  routerOptions,
};

export = configs;

import { Dropbox } from 'dropbox';
var fetch = require('isomorphic-fetch');

export const dropboxService = new Dropbox({
  fetch: fetch,
  accessToken: process.env.DROPBOX,
});

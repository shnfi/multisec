import express from 'express';
import mongoose from 'mongoose';
import router from './router.js';
import bodyParser from 'body-parser';

var port = 8080;
const server = express();

server.use(express.json());
server.use(router);

server.listen(port, () => {
   mongoose.connect('mongodb://127.0.0.1:27017/MultiSec')
   .then(() => {
      console.log("[✔] batabase connected!\n");
   }).catch((er) => {
      console.log(`[✘] database didn't connected: ${er}\n`);
   });

   console.log("[✔] server connected!");
});
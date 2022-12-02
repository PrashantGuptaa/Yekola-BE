// import express  from "express"
import healthController from "./controllers/health.controller";
const routes = require('express').Router;

routes.get('/', healthController);

console.log('====================', routes)
export default routes;
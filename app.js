const Koa = require('koa');
const controller = require('./controller');
const app = new Koa();
const bodyParser = require('koa-bodyParser');
const cors = require('@koa/cors');
const db = require("./Models");

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.method} ${ctx.request.url}`);
    await next();
})

app.use(bodyParser());
// app.use(cors);
app.use(controller());

app.listen(3000);
console.log('app started at port 3000');
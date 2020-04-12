const Koa = require('koa');
const controller = require('./controller');
const app = new Koa();
const bodyParser = require('koa-bodyParser');
const Sequelize = require('sequelize');
const fs = require('fs');

const env = JSON.parse(fs.readFileSync("./.env"));

let sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


app.use(async (ctx, next) => {
    console.log(`Process ${ctx.method} ${ctx.request.url}`);
    await next();
})

app.use(bodyParser());
app.use(controller());

app.listen(3000);
console.log('app started at port 3000');
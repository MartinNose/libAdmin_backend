'use strict'
let db = require('../Models');
let sequelize = require('sequelize');
let Op = sequelize.Op;
let Book = db.book;
let Borrow = db.borrow; 
let Query = ["category","bookname","start","end","author","low","high"]

function validCheck(con) {
    for (let i in con) {
        let flag = true;
        for (let j of Query) {
            if (j === i) {
                flag = false;
                break;
            }
        }
        if (flag) throw new Error('Invalid query: unpermitted attribute');
    }
}

function newquery(con) {
    let where = {};
    validCheck(con);
    for (let i of Query) {
        console.log(i)
        if (!con.hasOwnProperty(i) || con[i] === '');
        switch(i) {
            case 'start': 
                if (!where.hasOwnProperty('year')) {
                    where['year'] = {};
                }
                where['year'][Op.gte] = con[i];
                break;
            case 'end':
                if (!where.hasOwnProperty('year')) {
                    where['year'] = {};
                }
                where['year'][Op.lte] = con[i];
                break;
            case 'low':
                if (!where.hasOwnProperty('price')) {
                    where['price'] = {};
                }
                where['price'][Op.gte] = con[i];
                break;
            case 'high':
                if (!where.hasOwnProperty('price')) {
                    where['price'] = {};
                }
                where['price'][Op.lte] = con[i];
                break;
            default:
                where[i] = con[i]
        }
        console.log(where)
    }
    return where;
}

let curBk = async (ctx, next) => {
    if (!ctx.body.hasOwnProperty('bno')) {
        ctx.response.status = 400
        ctx.response.body = {
            err: 'Invalid Query'
        }
    }
    const bno = ctx.body.bno;
    await Borrow.findAll({where: {bno: bno}}).then(bks => {
        ctx.response.status = 200
        ctx.response['type'] = 'application/json';
        ctx.response.body = books;
    }).catch(err => {
        console.log(err)
        ctx.response.status = 500
        ctx.response.body = {
            err: err.errors[0]
        }
    })
}



module.exports = {
    'GET /api/curBk': curBk,
    'POST /api/borrowBk': borrowBk,
    'POST /api/returnBk': returnBk
}
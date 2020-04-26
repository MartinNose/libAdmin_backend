'use strict'
let db = require('../Models');
let sequelize = require('sequelize');
let Op = sequelize.Op;
let Book = db.book;
let Query = ["category","title","start","end","author","low","high"]

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
        if (!con.hasOwnProperty(i) || con[i] === '') continue;
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
    }
    return where;
}

let search = async (ctx, next) => {
    let where = {}
    try {
        where = newquery(ctx.request.body);
    } catch(e) {
        ctx.response.status = 400;
        ctx.response.body = {message:e.message};
        return
    }

    await Book.findAll({where: where}).then(books => {
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

let update = async (ctx, next) => {
    let newbook = ctx.request.body;
    let book = await Book.findOne({where:{bno:newbook.bno}})
    if(!book) {
        ctx.response.status = 400
        ctx.response.body = {
            err: "Illegal book number"
        }
        return
    }
    for (let i in newbook) {
        if (book.dataValues.hasOwnProperty(i) && newbook[i]) {
            book[i] = newbook[i]
            console.log(book[i])
        }
    }
    await book.save()
    ctx.response.status = 200
    ctx.response.body = book
}

module.exports = {
    'POST /api/search': search,
    'POST /api/update': update
}
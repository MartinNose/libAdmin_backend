'use strict'
let db = require('../Models');
let Book = db.book;
let Borrow = db.borrow; 
let Card = db.card;
let sequelize = db.sequelize;
let Op = require('sequelize').Op;

let curBk = async (ctx, next) => {
    if (!ctx.request.body.hasOwnProperty('cno')) {
        ctx.response.status = 400
        ctx.response.body = {
            err: 'Invalid Query'
        }
        return;
    }
    const cno = ctx.request.body.cno;
    await Borrow.findAll({where: {cno: cno}}).then(bks => {
        ctx.response.status = 200
        ctx.response['type'] = 'application/json';
        ctx.response.body = bks;
    }).catch(err => {
        console.log(err)
        ctx.response.status = 500
        ctx.response.body = {
            err: err.errors[0]
        }
    })
}

let checkBr = async (ctx) => {
    const bno = ctx.request.body.bno;
    const cno = ctx.request.body.cno;
    try {
        if (!ctx.request.body.hasOwnProperty('bno') || !ctx.request.body.hasOwnProperty('cno')) {
            throw new Error('Invalid Query');
        }

        await Card.findAll({where: {cno: cno}}).then(res => {
            if (res.length === 0) throw new Error('Invalid Card Number')
        })

        await Book.findAll({where: {bno: bno}}).then(res => {
            if (res.length === 0) throw new Error('Invalid Book Number');
            else if (res[0].stock === 0) {
                throw new Error('Book Out')
            }
        })
    } catch (e) {
        ctx.response.status = 400
        if (e.message !== 'Book Out') {
            ctx.response.body = {
                err: e.message
            }; 
        }else {
            await Borrow.findAll({
                order: ['return_date'],
                where:{
                    bno: bno, 
                    return_date: {
                        [Op.gte]: new Date().toISOString().split('T')[0]
                    }
                }
            }).then(results => {
                if (results.length === 0) {
                    ctx.response.body = {
                        err: 'No books available. All previous borrows are expired'
                    }
                } else {
                    ctx.response.body = {
                        err: 'No books available. The earliest possible date would be '
                        + results[0].return_date+'.'
                    }
                }
            })
        }
        return false
    }
    return true
}

let borrowBk = async (ctx, next) => {
    if (false === await checkBr(ctx)) return

    const bno = ctx.request.body.bno;
    const cno = ctx.request.body.cno;

    return sequelize.transaction(t => {
        return Book.findOne({where: {bno: bno}}, {transaction: t})
            .then(book => {
                if (book === null) throw new Error('No books are available')
                book.stock -= 1;
                book.save({transaction: t});
            }).then(()=>{
                let date = new Date();
                return Borrow.create({
                    cno: cno, bno: bno,
                    borrow_date: date.toISOString().split('T')[0],
                    return_date: new Date(date.setMonth(date.getMonth() + 2)).toISOString().split('T')[0]
                }, {transaction: t})
            })
        }).then(result => {
            ctx.response.status = 200
            ctx.response.body = result
            return result   
        }).catch(err => {
            console.log(err.message)
            ctx.response.status = 400
            ctx.response.body = {
                err: 'Borrow rejected due to technical reasons'
            }
        })
}

module.exports = {
    'GET /api/curBk': curBk,
    'POST /api/borrowBk': borrowBk
}


'use strict'
let db = require('../Models');
let Book = db.book;
let Borrow = db.borrow; 
let Card = db.card;
let sequelize = db.sequelize;
let Op = require('sequelize').Op;

let check = async (ctx) => {
    const bno = ctx.request.body.bno;
    const cno = ctx.request.body.cno;
    try {
        if (!ctx.request.body.hasOwnProperty('bno') || !ctx.request.body.hasOwnProperty('cno')) {
            throw new Error('Invalid Query');
        }

        await Borrow.findAll({where: {cno: cno, bno: bno}}).then(res => {
            if (res.length === 0) throw new Error('No records found')
        })

    } catch (e) {
        ctx.response.status = 400
        ctx.response.body = {
            err: e.message
        }; 
        return true
    }
}

let returnBk = async (ctx, next) => {
    if (false === await check(ctx)) return

    const bno = ctx.request.body.bno;
    const cno = ctx.request.body.cno;

    ctx.response.body = {}

    return sequelize.transaction(t => {
        return Book.findOne({where: {bno: bno}}, {transaction: t})
            .then(book => {
                if (book === null) throw new Error("Internal Error")
                book.stock += 1;
                book.save({transaction: t});
            }).then(()=>{
                return Borrow.findOne({where:{cno: cno, bno: bno}}, {transaction: t})
                .then(brw => {
                    if (brw === null) throw new Error("Internal Error")
                    if (new Date(brw.return_date) < new Date()) {
                        ctx.response.body.message = "Overdue"
                    } else {
                        ctx.response.body.message = "Accepted"
                    }
                    return brw.destroy({transaction: t})
                })
            })
        }).then(result => {
            ctx.response.status = 200
            ctx.response.body.result = result
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
    'POST /api/returnBk': returnBk
}
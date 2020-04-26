const db = require('../Models');
let Card = db.card;
let Borrow = db.borrow;
let instCd = async (ctx, next) => {
    console.log(ctx.request.body)
    await Card.create(ctx.request.body)
    .then(newcard => {
        ctx.response.status = 200
        ctx.response['type'] = 'application/json';
        ctx.response['body'] = newcard.dataValues
    })
    .catch((err) => {
        ctx.response.status = 400
        ctx.response.body = {
            err: err.message
        }
    });
}

let cancel = async (ctx, next) => {
    console.log("deleting")
    let body = ctx.request.body;
    if (!body.hasOwnProperty('cno')) {
        ctx.response.status = 400
        ctx.response.body = {
            err: "Invalid Request"
        }
    }
    const cno = body.cno;
    const record = await Borrow.findOne({where:{cno:cno}})
    if (record) {
        ctx.response.status = 400
        ctx.response.body = {
            err: "User having books not returned"
        }
        return
    }
    const card = await Card.findOne({where: {cno: cno}})
    if (card) {
        await card.destroy()
        ctx.response.status = 200
        ctx.response.body = {}
    } else {
        ctx.response.status = 400
        ctx.response.body = {
            err: "No such card number"
        }
    }
}

cardin = async (ctx, next) => {
    console.log(ctx.request.body)
    let res = await Card.findOne({where: {cno: ctx.request.body.cno}});
    if(res != null ){
        ctx.response.status = 200;
        ctx.response.body = res;
        console.log(res)
    } else {
        ctx.response.status = 400;
        ctx.response.body = {
            err: "Invalid card number"
        }
    }
}

allcard = async (ctx, next) => {
    let res = await Card.findAll()
    ctx.response.status = 200;
    ctx.response.body = res;
}

module.exports = {
    "GET /api/allcard": allcard,
    "POST /api/cardin": cardin,
    "POST /api/register" : instCd,
    "POST /api/cancel": cancel
}
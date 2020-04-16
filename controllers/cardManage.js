const db = require('../Models');
let Card = db.card;
let instCd = async (ctx, next) => {
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

let cardsErr = []

let insertCards = async (cards) => {
    for (c of cards) {
        await Card.create(c)
        .then(card => console.log(card))
        .catch((err) => cardsErr.push(err.errors[0]));
    }
}

let instCds = async (ctx, next) => {
    await insertCards(ctx.request.body.cards)
    if (cardsErr.length === 0) {
        ctx.response.status = 200
    } else {
        ctx.response.status = 500;
        ctx.response.body = {
            err: cardsErr
        }
    } 
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
    await Card.findAll({where: {cno: cno}})
        .then(async cards => {
            switch(cards.length){
            case 1: 
                const card = cards[0];
                await card.destroy().then((del) => {
                    ctx.response.status = 200
                    ctx.response.body = {
                        deleted: del
                    }
                }).catch(err => {
                    ctx.response.status = 500
                    ctx.response.body = {
                        err: err.message
                    }
                });
                break;
            case 0:
                ctx.response.status = 500
                ctx.response.body = {
                    err: "Not Found"
                }
                break;
            default:
                ctx.response.status = 500
                ctx.response.body = {
                    err: "Internal Error"
                }
            }
        }).catch(err => {
            ctx.response.status = 400
            ctx.response.body = {
                err: err.message
            }
        })
}

module.exports = {
    "POST /api/register" : instCd,
    // "POST /api/insertCards": instCds
    "DELETE /api/cancel": cancel
}
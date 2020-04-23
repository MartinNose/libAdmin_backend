let db = require('../Models');
let Book = db.book;
let Borrow = db.borrow;
let Card = db.card;
const sequlize = db.sequelize;

let count = async(ctx, next) => {
    let bookcnt = await Book.count();
    let cardcnt = await Card.count();
    let borrowcnt = await Borrow.count();

    ctx.response.status = 200;
    ctx.response.body = {
        bkcnt: bookcnt,
        cdcnt: cardcnt,
        brcnt: borrowcnt
    }
}

module.exports = {
    'GET /api/count': count
}
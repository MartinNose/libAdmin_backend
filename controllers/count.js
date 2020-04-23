let db = require('../Models');
let Book = db.book;
let Borrow = db.borrow;
let Card = db.card;

let count = async(ctx, next) => {
    
}

module.exports = {
    'GET /api/count': count
}
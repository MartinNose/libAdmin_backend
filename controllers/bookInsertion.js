const db = require('../Models');
let Book = db.book;
let instBk = async (ctx, next) => {
    let newbk;
    await Book.create(ctx.request.body)
    .then(newbook => {
        newbk = newbook;
        ctx.response.status = 200
        ctx.response['type'] = 'application/json';
        ctx.response['body'] = newbook.dataValues
    })
    .catch((err) => {
        ctx.response.status = 500
        ctx.response.body = {
            err: err.errors[0]
        }
    });
}

let booksErr = []

let insertBooks = async (books) => {
    for (b of books) {
        await Book.create(b)
        .then(book => console.log(book))
        .catch((err) => booksErr.push(err.errors[0]));
    }
}

let instBks = async (ctx, next) => {
    await insertBooks(ctx.request.body.books)
    if (booksErr.length === 0) {
        ctx.response.status = 200
    } else {
        ctx.response.status = 500;
        ctx.response.body = {
            err: booksErr
        }
    } 
}

module.exports = {
    "POST /api/insertBook" : instBk,
    "POST /api/insertBooks": instBks
}
const db = require('../Models');
let Book = db.book;
let instBk = async (ctx, next) => {
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



let insertBooks = async (books) => {
    let result = {
        booksErr:[],
        books:[]
    }
    for (b of books) {
        await Book.create(b)
        .then(book => result.books.push(book))
        .catch((err) => result.booksErr.push(err.message));
    }
    return result
}

let instBks = async (ctx, next) => {
    console.log(ctx.request.body)
    let result = await insertBooks(ctx.request.body)
    if (result.booksErr.length === 0) {
        ctx.response.status = 200
        ctx.response.body = result.books
    } else {
        ctx.response.status = 500;
        ctx.response.body = {
            err: result.booksErr
        }
    } 
}

module.exports = {
    "POST /api/insertBook" : instBk,
    "POST /api/insertBooks": instBks
}
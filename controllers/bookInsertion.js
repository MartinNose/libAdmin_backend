const db = require('./Models');
let Book = db.book;
let instBk = (ctx, next) => {
    Book.create(ctx.book).then(newbook => console.log(newbook));
}

let instBks = (ctx, next) => {
    books = JSON.parse(ctx.books);
    for (b in books) {
        Book.create(b).then(newbook => console.log(newbook));
    }
}

module.exports = {
    "POST /insertBook" : instBk,
    "POST /insertBooks": instBks
}
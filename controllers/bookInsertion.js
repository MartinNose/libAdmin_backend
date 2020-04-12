let insertBook= (book) => {
    //insert into book value....
}

let instBk = (ctx, next) => {
    //Check get book from ctx
    //Insert into DB
}

let instBks = (ctx, next) => {
    //
}

module.exports = {
    "POST /insertBook" : instBk,
    "POST /insertBooks": instBks
}
'use strict';
const card = require('./card');
const book = require('./book');
module.exports = (sequelize, DataTypes) => {
    const borrows = sequelize.define('borrows', {
        bno: {
            type: DataTypes.STRING(10),
            primarykey: true,
            reference: {
                model: book,
                id: 'bno'
            }
        },
        cno :{
            type: DataTypes.STRING(10),
            primarykey: true,
            reference: {
                model: card,
                id: 'cno'
            }
        },
        borrow_date: {
            type: DataTypes.STRING(10),
            isDate: true
        },
        return_date: {
            type: DataTypes.STRING(10),
            isDate: true
        },
    }, {}
    )
    borrows.associate = function(models) {
        // associations can be defined here
    };
    return borrows;
}
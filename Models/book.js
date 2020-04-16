'use strict';
module.exports = (sequelize, DataTypes) => {
    const book = sequelize.define('book', {
        bno: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        category: DataTypes.STRING(15),
        title: DataTypes.STRING(45),
        press: DataTypes.STRING(45),
        year: {
            type: DataTypes.STRING(10),
            isDate: true
        },
        author: DataTypes.STRING(45),
        price: DataTypes.INTEGER,
        total: DataTypes.INTEGER,
        stock: DataTypes.INTEGER
    }, {timestamps: false});
    book.associate = function(models) {

    };

    return book;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
    const book = sequelize.define('book', {
        bno: {
            type: DataTypes.STRING(10),
            primarykey: true
        },
        category: DataTypes.STRING(15),
        title: DataTypes.STRING(45),
        press: DataTypes.STRING(45),
        year: DataTypes.INTEGER,
        author: DataTypes.STRING,
        total: DataTypes.INTEGER,
        stock: DataTypes.INTEGER
    }, {});
    book.associate = function(models) {
        // associations can be defined here
    };
    return book;
};
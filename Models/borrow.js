'use strict';
module.exports = (sequelize, DataTypes) => {
    const card = sequelize.card;
    const book = sequelize.book;
    const borrow = sequelize.define('borrow', {
        bno: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            reference: {
                model: book,
                id: 'bno'
            }
        },
        cno :{
            type: DataTypes.STRING(10),
            primaryKey: true,
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
    }, {timestamps: false}
    )
    borrow.associate = function(models) {
        borrow.belongsTo(models.book, {foreignKey: 'bno'});
        borrow.belongsTo(models.card, {foreignKey: 'cno'});
    };
    return borrow;
}
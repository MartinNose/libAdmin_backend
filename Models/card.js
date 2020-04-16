'use strict';
module.exports = (sequelize, DataTypes) => {
    const card = sequelize.define('card', {
        cno: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        name: DataTypes.STRING(45),
        department: DataTypes.STRING(45),
        type: {
            type: DataTypes.STRING(1),
            validate: {
                isIn: [['T','S']]
            }
        }
    }, {timestamps: false}
    )
    card.associate = function(models) {

    };
    return card;
}
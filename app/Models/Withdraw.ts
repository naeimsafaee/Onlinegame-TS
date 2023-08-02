import {DataTypes, Model} from 'sequelize'
import sequelize from "../Providers/DataBaseServiceProvider";
import Coin from "./Coin";
import Player from "./Player";

class Withdraw extends Model {

    static table_name = "withdraws"
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        site_id: {
            type: DataTypes.INTEGER,
        },
        player_id: {
            type: DataTypes.INTEGER,
        },
        tx_id: {
            type: DataTypes.TEXT,
        },
        amount: {
            type: DataTypes.NUMBER,
        },
        dollar_amount: {
            type: DataTypes.NUMBER,
        },
        coin_id: {
            type: DataTypes.INTEGER,
        },
        address: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.STRING,
        },
        pay_at: {
            type: DataTypes.DATE,
        },
    }

}

Withdraw.init(Withdraw.attributes, {
    sequelize: sequelize,
    tableName: Withdraw.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

Withdraw.belongsTo(Coin, {targetKey: 'id', foreignKey: 'coin_id', as: 'coin'});
Withdraw.belongsTo(Player, {targetKey: 'id', foreignKey: 'player_id', as: 'player'});


export default Withdraw
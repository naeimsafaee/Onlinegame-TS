import {DataTypes, Model} from 'sequelize'
import sequelize from "../Providers/DataBaseServiceProvider";
import Coin from "./Coin";
import Player from "./Player";

class Deposit extends Model {

    static table_name = "deposits"
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
        coin_amount: {
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
        verify_at: {
            type: DataTypes.DATE,
        },
    }

}

Deposit.init(Deposit.attributes, {
    sequelize: sequelize,
    tableName: Deposit.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

Deposit.belongsTo(Coin, {targetKey: 'id', foreignKey: 'coin_id', as: 'coin'});
Deposit.belongsTo(Player, {targetKey: 'id', foreignKey: 'player_id', as: 'player'});


export default Deposit
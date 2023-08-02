import {DataTypes, Model} from 'sequelize'
import sequelize from "../Providers/DataBaseServiceProvider";

class Player extends Model {

    static table_name = "players"
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        site_id: {
            type: DataTypes.INTEGER,
        },
        wallet: {
            type: DataTypes.NUMBER,
        },
        email: {
            type: DataTypes.TEXT,
        },
        balance: {
            type: DataTypes.NUMBER,
        },
    }

}

Player.init(Player.attributes, {
    sequelize: sequelize,
    tableName: Player.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Player
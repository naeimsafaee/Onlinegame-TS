import {DataTypes, Model} from 'sequelize'
import sequelize from "../Providers/DataBaseServiceProvider";

class Coin extends Model {

    static table_name = "coins"
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        site_id: {
            type: DataTypes.INTEGER,
        },
        name: DataTypes.STRING,
        icon: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        symbol: DataTypes.STRING,
        ticker_id: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.TEXT
        }
    }

}

Coin.init(Coin.attributes, {
    sequelize: sequelize,
    tableName: Coin.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Coin
import {DataTypes, Model} from 'sequelize'
import sequelize from "../Providers/DataBaseServiceProvider";

class Site extends Model {

    static table_name = "sites"
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        api_key: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        app_key: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }

}

Site.init(Site.attributes, {
    sequelize: sequelize,
    tableName: Site.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Site
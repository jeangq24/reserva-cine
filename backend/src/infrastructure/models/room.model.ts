import { Model, DataTypes, Sequelize } from "sequelize";

export class RoomModel extends Model {
    public id!: string;
    public status!: boolean;
    public nameRoom!: string;
    public numberRoom!: number;

    static initialize(sequelize: Sequelize) {

        this.init(
            {
        
                id: {
                    type: DataTypes.STRING(36),
                    primaryKey: true,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
        
                nameRoom: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
        
                numberRoom: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
            },
        
            {
                sequelize,
                tableName: "room",
                timestamps: false,
            }
        )
        return this;
    }
}




import { Model, DataTypes, Sequelize } from "sequelize";

export class CustomerModel extends Model {
    public id!: string;
    public status!: boolean;
    public documentNumber!: string;
    public name!: string;
    public lastName!: string;
    public age!: number;
    public phone!: string;
    public email!: string;


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
                documentNumber: {
                    type: DataTypes.STRING(),
                    allowNull: false,
                    unique: true,

                },
                name: {
                    type: DataTypes.STRING(),
                    allowNull: false,
                },
                lastName: {
                    type: DataTypes.STRING(),
                    allowNull: false,

                },
                age: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                phone: {
                    type: DataTypes.STRING(),
                    allowNull: false,
                    unique: true,
                },
                email: {
                    type: DataTypes.STRING(),
                    allowNull: false,
                    unique: true,
                },
            },
            {
                sequelize,
                tableName: "customer",
                timestamps: false,
            }

        )
        return this;
    }
}


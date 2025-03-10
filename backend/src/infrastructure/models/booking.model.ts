import { Model, DataTypes, Sequelize } from "sequelize";

export class BookingModel extends Model {
    public id!: string;
    public status!: boolean;
    public dateBooking!: Date;
    public customerId!:string;
    public billboardId!:string;

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

                dateBooking: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
            },

            {
                sequelize,
                tableName: "booking",
                timestamps: false,
            }
        )
        return this;
    }
}


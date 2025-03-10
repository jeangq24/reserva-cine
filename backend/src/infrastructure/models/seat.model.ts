import { Model, DataTypes, Sequelize } from "sequelize";

export class SeatModel extends Model {
    public roomId!: string;
    public id!: string;
    public status!: boolean;
    public numberSeat!: number;
    public numberSeatRow!: number;

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

                numberSeat: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },

                numberSeatRow: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
            },

            {
                sequelize,
                tableName: "seat",
                timestamps: false,
            }
        )

        return this
    }
}

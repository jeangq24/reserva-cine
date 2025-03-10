// booking-seat.model.ts
import { Model, DataTypes, Sequelize } from "sequelize";

export class BookingSeatModel extends Model {
    public bookingId!: string;
    public seatId!: string;

    static initialize(sequelize: Sequelize) {
        this.init(
            {
                bookingId: {
                    type: DataTypes.STRING(36),
                    primaryKey: true,
                },
                seatId: {
                    type: DataTypes.STRING(36),
                    primaryKey: true,
                },
            },
            {
                sequelize,
                tableName: "booking_seat",
                timestamps: false,
            }
        );
        return this;
    }
}
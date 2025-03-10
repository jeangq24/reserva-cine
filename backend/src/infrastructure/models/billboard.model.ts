import { Model, DataTypes, Sequelize } from 'sequelize';

export class BillboardModel extends Model {
    public movieId!: string;
    public roomId!:string;
    public id!: string;
    public status!: boolean;
    public dateBillboard!: Date;
    public starTimeBillboard!: string;
    public endTimeBillboard!: string;

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

                dateBillboard: {
                    type: DataTypes.DATE,
                    allowNull: false
                },

                starTimeBillboard: {
                    type: DataTypes.STRING,
                    allowNull: false
                },

                endTimeBillboard: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },

            {
                sequelize,
                tableName: "billboard",
                timestamps: false,
            }

        )

        return this;

    }

}



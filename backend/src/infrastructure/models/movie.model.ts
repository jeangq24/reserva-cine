import { Model, DataTypes, Sequelize } from "sequelize";
import { MovieGenreEnum } from "../../domain/entities/movie.entity";

export class MovieModel extends Model {
    public id!: string;
    public status!: boolean;
    public nameMovie!: string;
    public genreMovie!: MovieGenreEnum;
    public allowedAgeMovie!: number;
    public lengthMinutesMovie!: number;

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
        
                nameMovie: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
        
                genreMovie: {
                    type: DataTypes.ENUM(...Object.values(MovieGenreEnum)),
                    allowNull: false
                },
        
                allowedAgeMovie: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
        
                lengthMinutesMovie: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
        
            },
        
            {
                sequelize,
                tableName: "movie",
                timestamps: false,
            }
        )
        return this;
    }
}


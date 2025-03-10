import { Transaction } from "sequelize";
import { MovieEntity, MovieGenreEnum } from "../../domain/entities/movie.entity";
import { MovieRepository } from "../../domain/repositories/movie.repository";
import { MovieResponseDto } from "../../application/dtos/movie.dto";
import { CustomException } from "../../domain/exceptions/CustomException";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { MovieModel } from "../models/movie.model";
import { Op } from "sequelize";
import { BaseId } from "../../domain/values-objects/base.ov";
import { ParseEntities } from "../../application/services/parse-entity.service";

export class SequelizeMovieRepository implements MovieRepository {


    public async save(movie: MovieEntity, transaction: Transaction): Promise<void> {
        const movieDto = new MovieResponseDto(movie);
        this.validIdCorrect(movieDto.id);
        await this.validateUniqueMovieData(movieDto);
        await MovieModel.upsert({ ...movieDto });
    }

    public async getAll(): Promise<MovieEntity[]> {
        const responde = await MovieModel.findAll();
        return responde.map(movie => ParseEntities.toMovieEntity(movie));
    }

    public async getById(id: BaseId): Promise<MovieEntity> {

        this.validIdCorrect(id.value);
        const movieModel = await MovieModel.findByPk(id.value);
        if (movieModel) {
            return ParseEntities.toMovieEntity(movieModel);
        } else {
            throw new CustomException(`La pelicula no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
    }


    public async delete(id: BaseId, transaction: Transaction): Promise<void> {
        this.validIdCorrect(id.value);
        const response = await MovieModel.destroy({ where: { id: id.value }, transaction })
        if (!response) {
            throw new CustomException(`La pelicula no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
    }

    private validIdCorrect(id: string) {
        if (typeof id !== "string" || id.length <= 0) {
            throw new CustomException(`Envie un "ID" de registro correcto`, ErrorCodes.INVALID_INPUT, HttpStatus.BAD_REQUEST)
        }

    }

    private async validateUniqueMovieData(movie: MovieResponseDto): Promise<void> {

        const whereCondition: any = {
            [Op.and]: [

                { nameMovie: movie.nameMovie },

            ]
        };

        const movieExists = await MovieModel.findOne({
            where: whereCondition
        });

        if (movieExists) {
            let messagge = "El nombre de la pelicula ya está registrado."
            throw new CustomException(messagge, ErrorCodes.RECORD_DUPLICATE_DATA, HttpStatus.CONFLICT);
        }
    }

}
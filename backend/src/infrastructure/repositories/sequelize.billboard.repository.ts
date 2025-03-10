import { Transaction } from "sequelize";
import { BillboardResponseDto } from "../../application/dtos/billboard.dto";
import { BillboardEntity } from "../../domain/entities/billboard.entity";
import { CustomException } from "../../domain/exceptions/CustomException";
import { ErrorCodes } from "../../domain/exceptions/Error.codes";
import { HttpStatus } from "../../domain/exceptions/HttpStatus";
import { BillboardRepository } from "../../domain/repositories/billboard.repository";
import { BaseId } from "../../domain/values-objects/base.ov";
import { BillboardModel } from "../models/billboard.model";
import { MovieModel } from "../models/movie.model";
import { RoomModel } from "../models/room.model";
import { ParseEntities } from "../../application/services/parse-entity.service";
import { Op } from "sequelize";

export class SequelizeBillboardRepository implements BillboardRepository {

    public async getAll(): Promise<BillboardEntity[]> {
        const response = await BillboardModel.findAll();
        const billboards = await Promise.all(response.map(async (billboard: BillboardModel) => {
            const roomId = billboard.roomId;
            const movieId = billboard.movieId;

            const roomModel = await RoomModel.findByPk(roomId);
            const movieModel = await MovieModel.findByPk(movieId);
            if (!roomModel) {
                throw new CustomException("No se encontro sala en la base de datos", ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            const roomEntity = ParseEntities.toRoomEntity(roomModel);
            if (!movieModel) {
                throw new CustomException("No se encontro pelicula en la base de datos", ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            const movieEntity = ParseEntities.toMovieEntity(movieModel);
            return ParseEntities.toBillboardEntity(billboard, roomEntity, movieEntity)

        }));
        return billboards;
    }

    public async getById(id: BaseId): Promise<BillboardEntity> {
        this.validIdCorrect(id.value);
        const billboardModel = await BillboardModel.findByPk(id.value);
        if (!billboardModel) {
            throw new CustomException(`La cartelera no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        const roomId = billboardModel.roomId;
        const movieId = billboardModel.movieId;

        const roomModel = await RoomModel.findByPk(roomId);
        const movieModel = await MovieModel.findByPk(movieId);
        if (!roomModel) {
            throw new CustomException("No se encontro sala en la base de datos", ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        const roomEntity = ParseEntities.toRoomEntity(roomModel);
        if (!movieModel) {
            throw new CustomException("No se encontro pelicula en la base de datos", ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        const movieEntity = ParseEntities.toMovieEntity(movieModel);
        return ParseEntities.toBillboardEntity(billboardModel, roomEntity, movieEntity)

    }

    public async getByFilters(filters: { startDate?: Date; endDate?: Date; categories?: string[]; }): Promise<BillboardEntity[]> {

        const billboardsEntities = await this.getAll();
        const normalizedCategories = filters.categories?.map(categorie => ParseEntities.normalizeGenre(categorie)) || [];
        return billboardsEntities.filter((billboardEntity) => {
            const billboardDate = new Date(billboardEntity.getDateBillboard().value);
            const billboardGenre = ParseEntities.normalizeGenre(billboardEntity.getMovie().getGenreMovie());
            const isDateInRange = !filters.startDate || !filters.endDate
                ? true
                : billboardDate > new Date(filters.startDate) && billboardDate <= new Date(filters.endDate);
            const matchesCategory = !normalizedCategories.length
                ? true
                : normalizedCategories.includes(billboardGenre);

            return isDateInRange && matchesCategory;
        });
    }

    public async save(billboard: BillboardEntity, transaction: Transaction): Promise<void> {
        const billboardDto = new BillboardResponseDto(billboard);
        const dateBillboard = new Date(billboardDto.dateBillboard)
        await BillboardModel.upsert({ ...billboardDto, dateBillboard }, { transaction });
    }


    public async cancel(billboard: BillboardEntity, transaction: Transaction): Promise<void> {
        const billboardDto = new BillboardResponseDto(billboard);

        const dateNow = new Date();
        if (new Date(billboardDto.dateBillboard) < dateNow) {
            throw new CustomException("No se puede cancelar funciones de la cartelera con fecha anterior a la actual", ErrorCodes.OUT_RANGE, HttpStatus.BAD_REQUEST);

        }
        await BillboardModel.upsert({ ...billboardDto, status: !billboardDto.status }, { transaction });
    }


    public async delete(id: BaseId, transaction: Transaction): Promise<void> {
        const response = await BillboardModel.destroy({ where: { id: id.value }, transaction })
        if (!response) {
            throw new CustomException(`La cartelera no existe en la base de datos.`, ErrorCodes.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
    }


    private validIdCorrect(id: string) {
        if (typeof id !== "string" || id.length <= 0) {
            throw new CustomException(`Envie un "ID" de registro correcto`, ErrorCodes.INVALID_INPUT, HttpStatus.BAD_REQUEST)
        }
    }
}
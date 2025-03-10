import { Transaction } from "sequelize";
import { MovieEntity } from "../entities/movie.entity";
import { BaseId } from "../values-objects/base.ov";

export interface MovieRepository {
    save(movie: MovieEntity, transaction: Transaction): Promise<void>;
    getAll(): Promise<MovieEntity[]>;
    getById(id: BaseId): Promise<MovieEntity> 
    delete(id: BaseId, transaction: Transaction): Promise<void>
}
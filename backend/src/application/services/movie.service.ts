import { Transaction } from "sequelize";
import { MovieEntity } from "../../domain/entities/movie.entity";
import { MovieRepository } from "../../domain/repositories/movie.repository";
import { BaseId } from "../../domain/values-objects/base.ov";

export class MovieService {
    constructor(private readonly repository: MovieRepository) { }

    public save(movie: MovieEntity, transaction: Transaction): Promise<void> {
        return this.repository.save(movie, transaction);
    }

    public getAll(): Promise<MovieEntity[]> {
        return this.repository.getAll();
    }

    public getById(id: BaseId): Promise<MovieEntity> {
        return this.repository.getById(id);
    }

    delete(id: BaseId, transaction: Transaction): Promise<void> {
        return this.repository.delete(id, transaction);
    }

}
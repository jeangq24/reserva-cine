import { MovieEntity } from "../../domain/entities/movie.entity";

export class MovieResponseDto { 
    public id!: string;
    public status!: boolean;
    public nameMovie!: string;
    public genreMovie!: string;
    public allowedAgeMovie!: number;
    public lengthMinutesMovie!: number;

    constructor (entity: MovieEntity)  {
        this.id = entity.getId().value;
        this.status = entity.getStatus().value;
        this.nameMovie = entity.getNameMovie().value;
        this.genreMovie = entity.getGenreMovie();
        this.allowedAgeMovie = entity.getAllowedAgeMovie().value;
        this.lengthMinutesMovie = entity.getLengthMinutesMovie().value;
    }
}
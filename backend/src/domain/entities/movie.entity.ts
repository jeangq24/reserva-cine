import { BaseId, BaseStatus } from "../values-objects/base.ov";
import { allowedAgeMovie, lengthMinutesMovie, nameMovie } from "../values-objects/movie.ov";
import { BaseEntity } from "./base.entity";

export enum MovieGenreEnum { ACTION='ACTION', ADVENTURE='ADVENTURE', COMEDY='COMEDY', DRAMA='DRAMA', FANTASY='FANTASY', HORROR='HORROR', MUSICALS='MUSICALS', MYSTERY='MYSTERY', ROMANCE='ROMANCE', SCIENCE_FICTION="SCIENCE FICTION", SPORTS='SPORTS', THRILLER='THRILLER', WESTERN='WESTERN', OTHER="OTHER" }

export class MovieEntity extends BaseEntity {
    private nameMovie: nameMovie;
    private genreMovie: MovieGenreEnum;
    private allowedAgeMovie: allowedAgeMovie;
    private lengthMinutesMovie: lengthMinutesMovie;

    constructor (idMovie: BaseId, statusMovie: BaseStatus, nameMovie: nameMovie, genreMovie: MovieGenreEnum, allowedAgeMovie: allowedAgeMovie, lengthMinutesMovie: lengthMinutesMovie) {
        super(idMovie, statusMovie);
        this.nameMovie = nameMovie;
        this.genreMovie = genreMovie;
        this.allowedAgeMovie = allowedAgeMovie;
        this.lengthMinutesMovie = lengthMinutesMovie;
    }

    public getNameMovie():nameMovie {
        return this.nameMovie;
    }


    public getGenreMovie():MovieGenreEnum {
        return this.genreMovie;
    }

    public getAllowedAgeMovie():allowedAgeMovie {
        return this.allowedAgeMovie;
    }

    public getLengthMinutesMovie():lengthMinutesMovie {
        return this.lengthMinutesMovie;
    }
    
}





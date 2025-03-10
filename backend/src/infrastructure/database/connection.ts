// connection.ts
import 'dotenv/config';
import { Sequelize } from 'sequelize';
import * as pg from 'pg';
import { defineModelRelations } from './relations';
import { CustomerModel } from '../models/customer.model';
import { BookingModel } from '../models/booking.model';
import { BillboardModel } from '../models/billboard.model';
import { SeatModel } from '../models/seat.model';
import { MovieModel } from '../models/movie.model';
import { RoomModel } from '../models/room.model';

class PostgreSQLDatabase {
    private static instance: PostgreSQLDatabase;
    private sequelize: Sequelize;
    

    private constructor() {
        this.sequelize = this.initializeConnection();
        this.registerModels()
        this.syncModels();
    }

    private registerModels(): void {
       
        CustomerModel.initialize(this.sequelize);
        BookingModel.initialize(this.sequelize);
        BillboardModel.initialize(this.sequelize);
        SeatModel.initialize(this.sequelize);
        MovieModel.initialize(this.sequelize);
        RoomModel.initialize(this.sequelize);
    }


    public static getInstance(): PostgreSQLDatabase {
        if (!PostgreSQLDatabase.instance) {
            PostgreSQLDatabase.instance = new PostgreSQLDatabase();
        }
        return PostgreSQLDatabase.instance;
    }

    private initializeConnection(): Sequelize {
        const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

        if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
            throw new Error('Faltan variables de entorno para la conexión a PostgreSQL');
        }

        return new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
            logging: (msg: string) => /*console.debug(msg)*/false,
            native: false,
            dialectModule: pg,
        });
    }

    private async syncModels(): Promise<void> {
        try {
            defineModelRelations()
            await this.sequelize.sync({ force: false });
            console.info('Sincronizado con la base de datos');
        } catch (error) {
            console.error('Error al sincronizar modelos:', error);
            process.exit(1);
        }
    }

    public getSequelizeInstance(): Sequelize {
        return this.sequelize;
    }
}

// Singleton para la conexión
export const database = PostgreSQLDatabase.getInstance();
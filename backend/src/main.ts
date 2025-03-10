import { database } from './infrastructure/database/connection';
import {server} from "./infrastructure/server";

class Main {
    public static async start(): Promise<void> {
        try {
         
            database.getSequelizeInstance();
            server.listen(process.env.PORT, () => {
                console.info(`Servidor ejecutándose en puerto: ${process.env.PORT}`);
            });
            
        } catch (error) {
            console.error('Error de inicialización:', error);
            process.exit(1);
        }
    }
}

Main.start();
import { BillboardService } from "../../application/services/billboard.service";
import { BookingService } from "../../application/services/booking.service";
import { CustomerService } from "../../application/services/customer.service";
import { MovieService } from "../../application/services/movie.service";
import { RoomService } from "../../application/services/room.service";
import { SeatService } from "../../application/services/seat.service";
import { BillboardController } from "../controllers/billboard.controller";
import { BookingController } from "../controllers/booking.controller";
import { RoomController } from "../controllers/room.controller";
import { SequelizeBookingRepository } from "../repositories/sequelize-booking.repository";
import { SequelizeCustomerRepository } from "../repositories/sequelize-customer.repository";
import { SequelizeMovieRepository } from "../repositories/sequelize-movie.repository";
import { SequelizeRoomRepository } from "../repositories/sequelize-room.repository";
import { SequelizeSeatRepository } from "../repositories/sequelize-seat.repository";
import { SequelizeBillboardRepository } from "../repositories/sequelize.billboard.repository";


//REPOSITORIOS
const repositoryCustomer = new SequelizeCustomerRepository();
const repositoryRoom = new SequelizeRoomRepository();
const respositorySeat = new SequelizeSeatRepository();
const repositoryBillboard = new SequelizeBillboardRepository();
const repositoryMovie = new SequelizeMovieRepository();
const repositoryBooking = new SequelizeBookingRepository()

//SERVICIOS 
const serviceCustomer = new CustomerService(repositoryCustomer);
const serviceRoom = new RoomService(repositoryRoom);
const serviceSeat = new SeatService(respositorySeat)
const serviceBillboard = new BillboardService(repositoryBillboard);
const serviceMovie = new MovieService(repositoryMovie);
const serviceBooking = new BookingService(repositoryBooking)

//EJECION DE CONTROLADORES
const controllerRoom = new RoomController(serviceRoom, serviceSeat);
const controllerBillboard = new BillboardController(serviceBillboard, serviceRoom, serviceMovie, serviceSeat, serviceBooking);
const controllerBooking = new BookingController(serviceBooking, serviceSeat, serviceBillboard, serviceCustomer, serviceRoom)

//CONTENEDOR
export const ServiceContainer = {
    room:controllerRoom,
    billboard: controllerBillboard,
    booking: controllerBooking
}
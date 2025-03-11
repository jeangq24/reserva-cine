import { Router } from "express";
import { ServiceContainer } from "../config/service-container";

const seatRouter = Router();
const controller = ServiceContainer.seat;

// TODAS LA SILLAS
seatRouter.get(
    "/seats",
    (req, res, next) => controller.getAll(req, res, next)
);

//SILLA POR ID
seatRouter.get(
    "/seats/:id",
    (req, res, next) => controller.getById(req, res, next)
);

//TODAS LA SILLAS QUE PERTENECE A UN ID ROOM
seatRouter.get(
    "/seats/rooms/:id",
    (req, res, next) => controller.getByRoomId(req, res, next)
);

export { seatRouter };
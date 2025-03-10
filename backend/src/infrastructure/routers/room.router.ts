import { Router } from "express";
import { validateDto } from "../middleware/validate-dto.middleware";
import { CreateRoomDto, UpdateRoomDto, DeleteRoomDto } from "../../application/dtos/room.dtos";
import { ServiceContainer } from "../config/service-container";

const roomRouter = Router();

const controller = ServiceContainer.room;

roomRouter.get(
    "/rooms",
    (req, res, next) => controller.getAll(req, res, next)
);

roomRouter.post(
    "/rooms",
    validateDto(CreateRoomDto),
    (req, res, next) => controller.create(req, res, next)
);

roomRouter.put(
    "/rooms",
    validateDto(UpdateRoomDto),
    (req, res, next) => controller.update(req, res, next)
);

roomRouter.put(
    "/rooms/seat/:id",
    (req, res, next) => controller.updateSeat(req, res, next)
);

roomRouter.get(
    "/rooms/availability/:id",
    (req, res, next) => controller.getSeatAvailability(req, res, next)
);

roomRouter.delete(
    "/rooms",
    validateDto(DeleteRoomDto),
    (req, res, next) => controller.delete(req, res, next)
);

roomRouter.get(
    "/rooms/:id",
    (req, res, next) => controller.getById(req, res, next)
);

export { roomRouter };
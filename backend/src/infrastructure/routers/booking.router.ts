import { Router } from "express";
import { validateDto } from "../middleware/validate-dto.middleware";
import { ServiceContainer } from "../config/service-container";
import { CancelBookingDto, CreateBookingDto } from "../../application/dtos/booking.dto";

const bookingRouter = Router();

const controller = ServiceContainer.booking;


bookingRouter.post(
    "/bookings",
    validateDto(CreateBookingDto),
    (req, res, next) => controller.create(req, res, next)
);

bookingRouter.get(
    "/bookings",
    (req, res, next) => controller.getAll(req, res, next)
);

bookingRouter.post(
    "/bookings/cancel",
    validateDto(CancelBookingDto),
    (req, res, next) => controller.cancel(req, res, next)
);

export { bookingRouter };
import { Router } from "express";
import { validateDto } from "../middleware/validate-dto.middleware";
import { ServiceContainer } from "../config/service-container";
import { CreateBookingDto } from "../../application/dtos/booking.dto";

const bookingRouter = Router();

const controller = ServiceContainer.booking;


bookingRouter.post(
    "/bookings",
    validateDto(CreateBookingDto),
    (req, res, next) => controller.create(req, res, next)
);

export { bookingRouter };
import { Router } from "express";
import { ServiceContainer } from "../config/service-container";
import { validateDto } from "../middleware/validate-dto.middleware";
import { CancelBillboardDto, CreateBillboardDto, DeleteBillboardDto } from "../../application/dtos/billboard.dto";

const billboardRouter = Router();
const controller = ServiceContainer.billboard;

billboardRouter.post(
    "/billboards",
    validateDto(CreateBillboardDto),
    (req, res, next) => controller.create(req, res, next)
);

billboardRouter.get(
    "/billboards",
    (req, res, next) => controller.getAll(req, res, next)
);

billboardRouter.delete(
    "/billboards",
    validateDto(DeleteBillboardDto),
    (req, res, next) => controller.delete(req, res, next)
);

billboardRouter.post(
    "/billboards/cancel",
    validateDto(CancelBillboardDto),
    (req, res, next) => controller.cancelBillboard(req, res, next)
);


export { billboardRouter };
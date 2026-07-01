import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import journeysRouter from "./journeys";

const router: IRouter = Router();

router.use(healthRouter);
router.use(meRouter);
router.use(journeysRouter);

export default router;

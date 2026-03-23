import { Router } from "express";
import { getSalesTerritoryData } from "../controllers/salesController";

const router = Router();

router.get("/territory", getSalesTerritoryData);

export default router;

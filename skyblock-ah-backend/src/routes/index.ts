import { Router } from "express";
import Auctions from "./auctions";
import userRequireMiddleware from "../middleware/userRequire";

const router = Router();

router.use(userRequireMiddleware);
router.use("/auctions", Auctions);

export default router;

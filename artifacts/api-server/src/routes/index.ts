import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsletterRouter from "./newsletter";
import studioRouter, { seedStudioIfEmpty } from "./studio";
import bedtimeStoriesRouter from "./bedtime-stories";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsletterRouter);
router.use(studioRouter);
router.use(bedtimeStoriesRouter);

// Fire-and-forget — seeds the canonical "Maxime Goes to Sleep" project once.
// Safe to call multiple times: it short-circuits if any project exists.
void seedStudioIfEmpty();

export default router;

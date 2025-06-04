import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Test endpoint hit');
        
        res.status(200).json({message: 'Hello, world!'});
    } catch (err) {
        next(err);
    }
});

export default router;

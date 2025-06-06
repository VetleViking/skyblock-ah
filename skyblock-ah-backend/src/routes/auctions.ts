import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';
import { getAuctions, setupSearchIndex } from '../utils/auctions';

const router = Router();


router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Test endpoint hit');
        
        res.status(200).json({message: 'Hello, world!'});
    } catch (err) {
        next(err);
    }
});

router.post('/get_page', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, options } = req.body;

        console.log('Fetching auctions for page:', page);

        // await setupSearchIndex();

        const auctionsData = await getAuctions(false, page, options);

        res.status(200).json({
            auctions: auctionsData.auctions
        });

    } catch (err) {
        next(err);
    }
});



export default router;

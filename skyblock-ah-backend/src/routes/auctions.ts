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

router.get('/get_page', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Number(req.query.page) || 0;
        const query = String(req.query.query || '');

        console.log('Fetching auctions for page:', page);

        // await setupSearchIndex();

        const auctionsData = await getAuctions(false, page, query);

        res.status(200).json({
            auctions: auctionsData.auctions
        });

    } catch (err) {
        next(err);
    }
});



export default router;

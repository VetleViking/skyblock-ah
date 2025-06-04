import { NextFunction, Request, Response, Router } from 'express';
import { redisClient } from '../redis-source';

const router = Router();

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Test endpoint hit');
        
        res.status(200).json({message: 'Hello, world!'});
    } catch (err) {
        next(err);
    }
});

router.get('/getall', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allSpots = await redisClient.hGetAll('spots');

        console.log('All spots:', allSpots);

        const now = Date.now();

        const zsetAuctions = await redisClient.zRangeWithScores('auctions_ending', now, now + 1000 * 60 * 60 * 24 * 14); // 14 days from now
        console.log('ZSet Auctions:', zsetAuctions); 

        

        res.status(200).json({message: 'Hello, world!'});
    } catch (err) {
        next(err);
    }
});

// let page = 0;
  //     let totalPages = Infinity;

  //     try {
  //       while (!cancelled && page < totalPages) {
  //         const res = await fetch(
  //           `https://api.hypixel.net/v2/skyblock/auctions?page=${page}`
  //         );
  //         const data: AuctionsResponse = await res.json();

  //         setAuctions(prev => [...prev, ...data.auctions]);

  //         totalPages = data.totalPages;
  //         page += 1;
  //       }
  //       if (!cancelled) setReachEnd(true);
  //     } catch (err) {
  //       if (!cancelled) console.error("Error fetching auctions:", err);
  //     } finally {
  //       if (!cancelled) setLoading(false);
  //     }

export default router;

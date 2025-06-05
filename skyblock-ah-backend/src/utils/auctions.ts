import { SchemaFieldTypes } from "redis";
import { redisClient } from "../redis-source";

type Auction = {
  auctioneer: string;
  bids: {
    amount: number;
    auction_id: string;
    bidder: string;
    profile_id: string;
    timestamp: number;
  }[];
  bin: boolean;
  categories: string[];
  category: string;
  claimed: boolean;
  claimed_bidders: string[];
  coop: string[];
  end: number;
  extra: string;
  highest_bid_amount: number;
  item_bytes: string;
  item_lore: string;
  item_name: string;
  item_uuid: string;
  last_updated: number;
  profile_id: string;
  start: number;
  starting_bid: number;
  tier: string;
  uuid: string;
};

type AuctionsResponse = {
  auctions: Auction[];
  lastUpdated: number;
  page: number;
  success: boolean;
  totalAuctions: number;
  totalPages: number;
};

export async function getAuctions(
    fetchAll: boolean = false,
    page: number = 0,
    query: string = ""
): Promise<{
    auctions: Auction[];
    lastUpdated: number;
}> {
    const pipe = redisClient.multi();
    let newLastUpdated = 0;
    
    let currentPage = 0;
    let totalPages = Infinity;
    let reachLastUpdate = false;
    
    const lastUpdated = Number(await redisClient.hGet("auction_data", "last_updated")) || 0;
    
    if (fetchAll) {
        await redisClient.del("auctions");
        await redisClient.del("auctions_by_start");
    }
    
    try {
        while (!reachLastUpdate && currentPage < totalPages) {
            const res = await fetch(`https://api.hypixel.net/v2/skyblock/auctions?page=${currentPage}`);
            const data: AuctionsResponse = await res.json();

            const lastAuction = data.auctions[0].start

            if (lastAuction <= lastUpdated && !fetchAll) {
                reachLastUpdate = true;
            }                    

            data.auctions.map((auction) => {
                pipe.json.set(`auction:${auction.uuid}`, "$", auction);
                pipe.zAdd("auctions_by_start", {
                    score: auction.start,
                    value: auction.uuid,
                });
            });

            await pipe.exec();
            
            totalPages = data.totalPages;
            currentPage += 1;
            
            newLastUpdated = data.lastUpdated;
        }
    } catch (err) {
        console.error("Error fetching auctions:", err);
    }
    
    await redisClient.hSet("auction_data", "last_updated", newLastUpdated);
    
    const auctions = await readAuctionPage(page, query);

    return {
        auctions: auctions,
        lastUpdated: newLastUpdated
    }
}

const REDISEARCH_SPECIAL = /[\\@+\-=&|><{}()[\]^"~*?:/]/g;

function escapeSearchQuery(raw: string): string {
  return raw.replace(REDISEARCH_SPECIAL, ch => `\\${ch}`);
}

const PAGE_SIZE = 1000;

export async function readAuctionPage(page = 0, query = ""): Promise<Auction[]> {
    const startIdx = page * PAGE_SIZE;
    const endIdx   = startIdx + PAGE_SIZE - 1;

    const uuids = await redisClient.zRange(
        "auctions_by_start",
        startIdx,
        endIdx,
        {
            REV: true,
        }
    );
    if (!uuids.length) return [];

    let auctions: any[] = [];

    if (query) {
        console.log("Searching for query:", escapeSearchQuery(query));

        const res = await redisClient.ft.search(
            "idx:auction",
            `@item_name:"${escapeSearchQuery(query)}"`,
            { LIMIT: { from: 0, size: 1000 } }
        );
        if (!res || !res.documents) {
            return [];
        }

        auctions = res.documents.map(doc => doc.value);
    } else {
        const pipe = redisClient.multi();
        uuids.forEach(id => pipe.json.get(`auction:${id}`));
        const rows = await pipe.exec() as any[]; // TODO: Fix type
        auctions = rows;
    }

    return auctions;
}

export async function setupSearchIndex() {
    await redisClient.ft.create(
        "idx:auction",
        {
            "$.item_name": {
                type: SchemaFieldTypes.TEXT,
                AS: "item_name",
            },
            "$.bin": {
                type: SchemaFieldTypes.TAG,
                AS: "bin",
            },
            "$.starting_bid": {
                type: SchemaFieldTypes.NUMERIC,
                AS: "starting_bid",
            },
            "$.highest_bid_amount": {
                type: SchemaFieldTypes.NUMERIC,
                AS: "highest_bid_amount",
            },
        },
        {
            ON: "JSON",
            PREFIX: ["auction:"],
        }
    );
}
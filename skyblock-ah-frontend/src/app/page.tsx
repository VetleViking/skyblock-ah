"use client";

import { useEffect, useState } from "react";

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

export default function Home() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(false);
  const [reachEnd, setReachEnd] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchAllPages = async () => {
      setLoading(true);
      let page = 0;
      let totalPages = Infinity;

      try {
        while (!cancelled && page < totalPages) {
          const res = await fetch(
            `https://api.hypixel.net/v2/skyblock/auctions?page=${page}`
          );
          const data: AuctionsResponse = await res.json();

          setAuctions(prev => [...prev, ...data.auctions]);

          totalPages = data.totalPages;
          page += 1;
        }
        if (!cancelled) setReachEnd(true);
      } catch (err) {
        if (!cancelled) console.error("Error fetching auctions:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAllPages();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Auctions</h1>

      {loading && <p>Loading…</p>}
      {reachEnd && !loading && (
        <p>
          Finished loading <strong>{auctions.length}</strong> auctions.
        </p>
      )}

      <ul>
        {auctions.map(a => (
          <li key={a.uuid} className="mb-1">
            {a.item_name} – { a.highest_bid_amount >= a.starting_bid ? a.highest_bid_amount.toLocaleString() : a.starting_bid.toLocaleString()} coins
          </li>
        ))}
      </ul>
    </div>
  );
}

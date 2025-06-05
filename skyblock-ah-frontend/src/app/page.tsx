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
  const BASE_URL = process.env.NEXT_PUBLIC_DATABASE_IP || "http://localhost:4000";
  const apiBase = `${BASE_URL}/api/v1/auctions`;

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [auctions, setAuctions] = useState<Auction[]>([]);

  const testDb = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/get_page${query ? `?query=${encodeURIComponent(query)}` : ""}`);
      const data = await res.json();
      console.log("Response:", data);
      setAuctions(data.auctions || []);
    } catch (err) {
      console.error("Error fetching test endpoint:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Auctions</h1>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search auctions..."
          className="border p-2 rounded w-full"
          />
        <button
          onClick={testDb}
          className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
          Test DB Connection
        </button>
      </div>
      {loading && <p>Loading…</p>}
      <div>
        {auctions.length > 0 ? (
          <ul className="space-y-4">
            {auctions.map((auction) => (
              <li key={auction.uuid} className="border p-4 rounded">
                <h2 className="font-bold">{auction.item_name}</h2>
                <p>Starting Bid: {auction.starting_bid}</p>
                <p>Highest Bid: {auction.highest_bid_amount}</p>
                <p>End Time: {new Date(auction.end * 1000).toLocaleString()}</p>
                <p>Bin: {auction.bin ? "Yes" : "No"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No auctions found.</p>
        )}
      </div>
    </div>
  );
}

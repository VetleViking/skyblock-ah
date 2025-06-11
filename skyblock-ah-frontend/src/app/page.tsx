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
    const [auctions, setAuctions] = useState<Auction[]>([]);

    const [query, setQuery] = useState("");
    const [bin, setBin] = useState<boolean|null>(null);
    const [sortBy, setSortBy] = useState<"end" | "starting_bid" | "highest_bid_amount">("end");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [stars, setStars] = useState<number>(0);

    const testDb = async () => {
        if (loading) return;

        setLoading(true);

        const finishedQuery = stars > 0 ? `${query} ${
            stars <= 5 ? "✪".repeat(stars) : "✪✪✪✪✪" + ["➊", "➋", "➌", "➍", "➎"][stars - 6]
        }` : query;

        try {
            const res = await fetch(`${apiBase}/get_page`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    page: 0,
                    options: {
                        query: finishedQuery,
                        bin: bin,
                        sort_by: sortBy,
                        sort_order: sortOrder,
                    },
                }),
            });

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
                <div className="flex items-center mb-2 gap-2">
                    <select
                        value={bin?.toString() ?? ""}
                        onChange={(e) => setBin(e.target.value === "true" ? true : e.target.value === "false" ? false : null)}
                        className="border p-2 rounded"
                    >
                        <option value="">All Auctions</option>
                        <option value="true">BIN Auctions</option>
                        <option value="false">Non-BIN Auctions</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "end" | "starting_bid" | "highest_bid_amount")}
                        className="border p-2 rounded"
                    >
                        <option value="end">Sort by End Time</option>
                        <option value="starting_bid">Sort by Starting Bid</option>
                        <option value="highest_bid_amount">Sort by Highest Bid Amount</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                        className="border p-2 rounded"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <select
                        value={stars.toString()}
                        onChange={(e) => setStars(Number(e.target.value))}
                        className="border p-2 rounded"
                    >
                        <option value="0">Any amount of stars</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                        <option value="6">6 Stars</option>
                        <option value="7">7 Stars</option>
                        <option value="8">8 Stars</option>
                        <option value="9">9 Stars</option>
                        <option value="10">10 Stars</option>
                    </select>
                </div>
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
                    Fetch Auctions
                </button>
            </div>
            {loading ? <p>Loading…</p> : <div>
                {auctions.length > 0 ? (
                    <ul className="space-y-4">
                        {auctions.map((auction) => (
                            <li key={auction.uuid} className="border p-4 rounded">
                                <h2 className="font-bold">{auction.item_name}</h2>
                                <p>Starting Bid: {auction.starting_bid.toLocaleString()}</p>
                                <p>Highest Bid: {auction.highest_bid_amount.toLocaleString()}</p>
                                <p>End Time: {new Date(auction.end).toLocaleString()}</p>
                                <p>Bin: {auction.bin ? "Yes" : "No"}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No auctions found.</p>
                )}
            </div>
            }
        </div>
    );
}

import { errorHandeler } from "../utils/errorHandler.js";
import pool from '../db/db.js';

export const placebid = async (req, res, next) => {
    const { user_id, auction_id, amount } = req.body;

    try {
        const result = await pool.query('SELECT * FROM "auction" WHERE id = $1', [auction_id]);

        if (result.rows.length === 0) {
            return next(errorHandeler(404, 'Auction not found'));
        }

        const selectedAuction = result.rows[0];

        const isValidBid = (
            (selectedAuction.auction_style === 'increasing' &&
                amount > selectedAuction.current_max_bid &&
                (amount - selectedAuction.current_max_bid) >= selectedAuction.increment_amount)
            ||
            (selectedAuction.auction_style === 'decreasing' &&
                amount < selectedAuction.current_max_bid &&
                (selectedAuction.current_max_bid - amount) >= selectedAuction.increment_amount)
        ) && selectedAuction.status === 'running';

        if (parseInt(selectedAuction.user_id) === parseInt(user_id)) {
            return next(errorHandeler(400, 'Cannot place a bid on your own auction'));
        }

        if (!isValidBid) {
            return next(errorHandeler(400, 'Invalid bid amount or auction is not running'));
        }

        const newBid = await pool.query(
            `INSERT INTO "bid" (user_id, auction_id, amount) 
             VALUES ($1, $2, $3) RETURNING *`,
            [user_id, auction_id, amount]
        );

        await pool.query(
            `UPDATE "auction" 
             SET "current_max_bid" = $1, "bid_winner_id" = $2
             WHERE "id" = $3`,
            [amount, user_id, auction_id]
        );

        res.status(201).json(newBid.rows[0]);

    } catch (error) {
        console.error('Error placing bid:', error);
        return next(errorHandeler(500, 'Internal server error placing bid'));
    }
};

// export const startProxyBid = async (req, res, next) => {
//     const { user_id, auction_id, amount, increasing_amount } = req.body;

//     try {
//         const result = await pool.query('SELECT * FROM "auction" WHERE id = $1', [auction_id]);

//         if (result.rows.length === 0) {
//             return next(errorHandeler(404, 'Auction not found'));
//         }

//         const selectedAuction = result.rows[0];
//         if(selectedAuction.status === 'running'&&selectedAuction.auction_style === 'increasing'&&amount > (selectedAuction.current_max_bid+increasing_amount)&&)



//     } catch (error) {
//         console.error('Error placing bid:', error);
//         return next(errorHandeler(500, 'Internal server error placing bid'));
//     }

// }

// CREATE TABLE "proxy_bidding" (
//     "id" BIGSERIAL PRIMARY KEY,
//     "user_id" bigint,
//     "auction_id" bigint,
//     "amount" decimal(10,2),
//     "increasing_amount" decimal(10,2)
//   );


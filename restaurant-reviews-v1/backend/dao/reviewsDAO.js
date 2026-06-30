import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        
        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
        } catch (err) {
            console.error(`Unable to establish collection handles in userDAO: ${err}`);
        }
    }

    static async addReview(restaurantId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                restaurant_id: new ObjectId(restaurantId),
            };

            return await reviews.insertOne(reviewDoc);
        } catch (err) {
            console.error(`Unable to post review: ${err}`);
            return { error: err };
        }
    }

    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id: new ObjectId(reviewId) },
                { $set: { text: text, date: date } },
            );

            return updateResponse;
        } catch (err) {
            console.error(`Unable to update review: ${err}`);
            return { error: err };
        }
    }
}
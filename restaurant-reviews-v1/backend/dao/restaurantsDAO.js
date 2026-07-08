let restaurants;

export default class RestaurantsDAO {
  static async injectDB(conn) {
    if (restaurants) {
      return;
    }
    try {
      restaurants = await conn.db("db").collection("restaurants");
      // console.log("RestaurantsDAO: 10");
      // console.log(restaurants);
    } catch (err) {
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${err}`
      );
    }
  }

  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = {"name": { $regex: filters["name"], $options: "i" }};
        // query = { $text: { $search: filters["name"] } };
        // query.$text = { $search: filters["name"] };
      } else if ("cuisine" in filters) {
        query = { "cuisine": { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        console.log("zip");
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    let cursor;

    try {
      cursor = await restaurants
        .find(query);
    } catch (err) {
      console.error(`Unable to issue find command, ${err}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    console.log("48");
    console.log(typeof cursor);
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

    try {
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);

      return { restaurantsList, totalNumRestaurants };
    } catch (err) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${err}`,
      );
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }

  static async getRestaurantByID(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$restaurant_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviews: "$reviews",
          },
        },
      ]
      return await restaurants.aggregate(pipeline).next();
    } catch (err) {
      console.error(`Something went wrong in getRestaurantByID: ${err}`);
      throw err;
    }
  }

  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await restaurants.distinct("cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }
}
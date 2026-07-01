import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {

    static async apiGetRestaurantById(req, res, next) {
        try {
            let id = req.params.id || {};
            let restaurant = await RestaurantsDAO.getRestaurantByID(id);
            if (!restaurant) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json(restaurant);
        } catch (err) {
            console.log(`api, ${err}`);
            res.status(500).json({ error: err });
        }
    }

    static async apiGetRestaurantCuisines(req, res, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines();
            res.json(cuisines);
        } catch (err) {
            console.log(`api, ${err}`);
            res.status(500).json({ error: err });
        }
    }
}
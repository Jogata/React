class RestaurantDataService {
  getAllRestaurants(page = 0) {
    return fetch(`http://localhost:5000/api/v1/restaurants?page=${page}`);
  }

  getRestaurant(id) {
    // console.log(id);
    return fetch(`http://localhost:5000/api/v1/restaurants/${id}`);
  }

  findRestaurants(query, by = "name", page = 0) {
    console.log(query, by, page);
    return fetch(`http://localhost:5000/api/v1/restaurants?${by}=${query}&page=${page}`);
  } 

  createReview(data) {
    return fetch("/review-new", data);
  }

  updateReview(data) {
    return fetch("/review-edit", data);
  }

  deleteReview(id, userId) {
    return fetch(`/review-delete?id=${id}`, {data:{user_id: userId}});
  }

  getCuisines(id) {
    return fetch(`/cuisines`);
  }
}

export default new RestaurantDataService();
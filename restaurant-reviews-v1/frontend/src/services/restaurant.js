class RestaurantDataService {
  getAllRestaurants(page = 0) {
    return fetch(`http://localhost:5000/api/v1/restaurants?page=${page}`);
  }

  getRestaurant(id) {
    return fetch(`http://localhost:5000/api/v1/restaurants/${id}`);
  }

  findRestaurants(query, by = "name", page = 0) {
    console.log(query, by, page);
    return fetch(`http://localhost:5000/api/v1/restaurants?${by}=${query}&page=${page}`);
  } 

  createReview(data) {
    return fetch("http://localhost:5000/api/v1/restaurants/review", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(data)
    });
  }

  updateReview(data) {
    return fetch("http://localhost:5000/api/v1/restaurants/review", {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(data)
    });
  }

  deleteReview(id, userId) {
    console.log(userId);
    return fetch(`http://localhost:5000/api/v1/restaurants/review?id=${id}`, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify({data:{user_id: userId}})
    });
  }

  getCuisines(id) {
    return fetch(`/cuisines`);
  }
}

export default new RestaurantDataService();
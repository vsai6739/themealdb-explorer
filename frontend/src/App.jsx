import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:8080/api";

function App() {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      setMessage("Unable to load categories. Please try again.");
    }
  };

  const searchMeals = async () => {
    if (!searchText.trim()) {
      setMessage("Please enter a meal name to search.");
      return;
    }

    setLoading(true);
    setMessage("");
    setSelectedMeal(null);
    setSelectedCategory("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/meals/search?name=${encodeURIComponent(searchText)}`
      );
      const data = await response.json();

      if (!data.meals) {
        setMeals([]);
        setMessage(`No meals found for "${searchText}".`);
      } else {
        setMeals(data.meals);
      }
    } catch (error) {
      setMessage("Something went wrong while searching meals.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMealsByCategory = async (category) => {
    setLoading(true);
    setMessage("");
    setSelectedMeal(null);
    setSelectedCategory(category);
    setSearchText("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/meals/category/${encodeURIComponent(category)}`
      );
      const data = await response.json();
      setMeals(data.meals || []);
    } catch (error) {
      setMessage("Unable to load meals for this category.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomMeal = async () => {
    setLoading(true);
    setMessage("");
    setSelectedCategory("");
    setSearchText("");

    try {
      const response = await fetch(`${API_BASE_URL}/meals/random`);
      const data = await response.json();

      if (data.meals && data.meals.length > 0) {
        setSelectedMeal(data.meals[0]);
        setMeals([]);
      }
    } catch (error) {
      setMessage("Unable to load random meal.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMealDetails = async (id) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/meals/${id}`);
      const data = await response.json();

      if (data.meals && data.meals.length > 0) {
        setSelectedMeal(data.meals[0]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      setMessage("Unable to load meal details.");
    } finally {
      setLoading(false);
    }
  };

  const getIngredients = (meal) => {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() : ""} ${ingredient.trim()}`);
      }
    }

    return ingredients;
  };

  const getYoutubeEmbedUrl = (youtubeUrl) => {
    if (!youtubeUrl) return null;

    const videoId = youtubeUrl.split("v=")[1];
    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId.split("&")[0]}`;
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>TheMealDB Explorer</h1>
        <p>Search recipes, browse categories, and discover random meals.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search meals, e.g. chicken"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchMeals()}
          />
          <button onClick={searchMeals}>Search</button>
          <button className="secondary-btn" onClick={fetchRandomMeal}>
            I'm feeling hungry
          </button>
        </div>
      </header>

      {message && <p className="message">{message}</p>}
      {loading && <p className="loading">Loading...</p>}

      {selectedMeal && (
        <section className="meal-details">
          <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />

          <div className="meal-info">
            <h2>{selectedMeal.strMeal}</h2>
            <p>
              <strong>Category:</strong> {selectedMeal.strCategory || "N/A"}
            </p>
            <p>
              <strong>Area:</strong> {selectedMeal.strArea || "N/A"}
            </p>

            <h3>Ingredients</h3>
            <ul>
              {getIngredients(selectedMeal).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>Instructions</h3>
            <p className="instructions">{selectedMeal.strInstructions}</p>

            {getYoutubeEmbedUrl(selectedMeal.strYoutube) && (
              <>
                <h3>Video Tutorial</h3>
                <iframe
                  src={getYoutubeEmbedUrl(selectedMeal.strYoutube)}
                  title={selectedMeal.strMeal}
                  allowFullScreen
                ></iframe>
              </>
            )}
          </div>
        </section>
      )}

      <section className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category.idCategory}
              className={selectedCategory === category.strCategory ? "active" : ""}
              onClick={() => fetchMealsByCategory(category.strCategory)}
            >
              {category.strCategory}
            </button>
          ))}
        </div>
      </section>

      <section className="meals-section">
        {meals.length > 0 && <h2>Meals</h2>}

        <div className="meal-grid">
          {meals.map((meal) => (
            <div className="meal-card" key={meal.idMeal}>
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <div className="meal-card-content">
                <h3>{meal.strMeal}</h3>
                <button onClick={() => fetchMealDetails(meal.idMeal)}>
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
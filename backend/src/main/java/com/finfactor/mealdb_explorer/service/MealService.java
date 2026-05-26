package com.finfactor.mealdb_explorer.service;

import com.finfactor.mealdb_explorer.client.TheMealDbClient;
import org.springframework.stereotype.Service;

@Service
public class MealService {

    private final TheMealDbClient theMealDbClient;

    public MealService(TheMealDbClient theMealDbClient) {
        this.theMealDbClient = theMealDbClient;
    }

    public String getCategories() {
        return theMealDbClient.getCategories();
    }

    public String searchMealsByName(String name) {
        return theMealDbClient.searchMealsByName(name);
    }

    public String getMealsByCategory(String category) {
        return theMealDbClient.getMealsByCategory(category);
    }

    public String getRandomMeal() {
        return theMealDbClient.getRandomMeal();
    }

    public String getMealById(String id) {
        return theMealDbClient.getMealById(id);
    }
}
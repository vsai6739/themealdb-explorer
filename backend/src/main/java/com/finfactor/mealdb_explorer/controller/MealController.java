package com.finfactor.mealdb_explorer.controller;

import com.finfactor.mealdb_explorer.service.MealService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping(value = "/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getCategories() {
        return mealService.getCategories();
    }

    @GetMapping(value = "/meals/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public String searchMealsByName(@RequestParam String name) {
        return mealService.searchMealsByName(name);
    }

    @GetMapping(value = "/meals/category/{category}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getMealsByCategory(@PathVariable String category) {
        return mealService.getMealsByCategory(category);
    }

    @GetMapping(value = "/meals/random", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRandomMeal() {
        return mealService.getRandomMeal();
    }

    @GetMapping(value = "/meals/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getMealById(@PathVariable String id) {
        return mealService.getMealById(id);
    }
}
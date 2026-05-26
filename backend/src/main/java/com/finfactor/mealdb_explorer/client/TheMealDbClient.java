package com.finfactor.mealdb_explorer.client;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class TheMealDbClient {

    private static final String BASE_URL = "https://www.themealdb.com/api/json/v1/1";

    private final RestClient restClient;

    public TheMealDbClient() {
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .build();
    }

    @Cacheable(value = "categories")
    public String getCategories() {
        return restClient.get()
                .uri("/categories.php")
                .retrieve()
                .body(String.class);
    }

    @Cacheable(value = "mealSearch", key = "#name")
    public String searchMealsByName(String name) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.php")
                        .queryParam("s", name)
                        .build())
                .retrieve()
                .body(String.class);
    }

    @Cacheable(value = "mealsByCategory", key = "#category")
    public String getMealsByCategory(String category) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/filter.php")
                        .queryParam("c", category)
                        .build())
                .retrieve()
                .body(String.class);
    }

    public String getRandomMeal() {
        return restClient.get()
                .uri("/random.php")
                .retrieve()
                .body(String.class);
    }

    @Cacheable(value = "mealDetails", key = "#id")
    public String getMealById(String id) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/lookup.php")
                        .queryParam("i", id)
                        .build())
                .retrieve()
                .body(String.class);
    }
}
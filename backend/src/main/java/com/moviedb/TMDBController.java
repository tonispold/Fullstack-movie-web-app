package com.moviedb;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*") // ✅ Allow requests from any origin (for testing)
public class TMDBController {
    private final TMDBService tmdbService;

    public TMDBController(TMDBService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/popular")
    public List<Movie> getPopularMovies(@RequestParam(defaultValue = "1") int page) {
        return tmdbService.fetchPopularMovies(page);
    }

    @GetMapping("/details/{id}") // ✅ Fixed URL pattern
    public ResponseEntity<String> getMovieDetails(@PathVariable Long id) {
        return ResponseEntity.ok(tmdbService.getMovieDetails(id).toString());
    }
}

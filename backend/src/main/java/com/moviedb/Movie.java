package com.moviedb;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
public class Movie {
    @Id
    private Long id; // ✅ Add the movie ID

    private String title;
    private String posterPath;
    private String overview;
    private int runtime;
    private String releaseDate;
    private double voteAverage;

    // Constructor
    public Movie(Long id, String title, String posterPath, String overview, int runtime, String releaseDate,
            double voteAverage) {
        this.id = id; // ✅ Include ID
        this.title = title;
        this.posterPath = posterPath;
        this.overview = overview;
        this.runtime = runtime;
        this.releaseDate = releaseDate;
        this.voteAverage = voteAverage;
    }
}

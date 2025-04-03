package com.moviedb;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TMDBService {
    private final RestTemplate restTemplate;
    private final String BASE_URL = "https://api.themoviedb.org/3";
    private final String API_KEY = "8f5173a64813bdd3d35b63998681c102";

    public TMDBService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Movie> fetchPopularMovies(int page) {
        List<Movie> popularMovies = new ArrayList<>();

        // Modify the URL to accept the page parameter
        String url = BASE_URL + "/movie/popular?api_key=" + API_KEY + "&page=" + page;
        String response = restTemplate.getForObject(url, String.class);

        try {
            JSONObject root = new JSONObject(response);
            JSONArray results = root.getJSONArray("results");

            if (results != null) {
                for (int i = 0; i < results.length(); i++) {
                    JSONObject movieNode = results.getJSONObject(i);
                    Long id = movieNode.getLong("id"); // Fetch ID from TMDB
                    String title = movieNode.getString("title");
                    String posterPath = movieNode.getString("poster_path");
                    String overview = movieNode.getString("overview");
                    int runtime = movieNode.has("runtime") ? movieNode.getInt("runtime") : 0;
                    String releaseDate = movieNode.getString("release_date");
                    double voteAverage = movieNode.getDouble("vote_average");

                    // Create a Movie object with all details
                    Movie movie = new Movie(id, title, posterPath, overview, runtime, releaseDate, voteAverage);
                    popularMovies.add(movie);
                }
            }
        } catch (Exception e) {
            e.printStackTrace(); // Handle any parsing errors
        }

        return popularMovies;
    }

    public JSONObject getMovieDetails(Long movieId) {
        try {
            // Fetch movie details from the main API endpoint
            String url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + API_KEY
                    + "&append_to_response=credits";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JSONObject movieDetails = new JSONObject(response.getBody());

                // Extract genres
                JSONArray genresArray = movieDetails.getJSONArray("genres");
                JSONArray genres = new JSONArray();

                for (int i = 0; i < genresArray.length(); i++) {
                    JSONObject genreObj = genresArray.getJSONObject(i);
                    genres.put(genreObj.getString("name"));
                }

                // Add genres to movie details
                movieDetails.put("genres", genres);

                // Extract cast details (name + profile picture)
                JSONArray castArray = movieDetails.getJSONObject("credits").getJSONArray("cast");
                JSONArray castWithImages = new JSONArray();

                for (int i = 0; i < castArray.length(); i++) {
                    JSONObject castMember = castArray.getJSONObject(i);
                    JSONObject castInfo = new JSONObject();
                    castInfo.put("name", castMember.getString("name"));
                    castInfo.put("profilePath", castMember.optString("profile_path", null));
                    castWithImages.put(castInfo);
                }

                // Add cast to movie details
                movieDetails.put("cast", castWithImages);

                // Extract Directors & Writers
                JSONArray crewArray = movieDetails.getJSONObject("credits").getJSONArray("crew");
                JSONArray directors = new JSONArray();
                JSONArray writers = new JSONArray();

                for (int i = 0; i < crewArray.length(); i++) {
                    JSONObject crewMember = crewArray.getJSONObject(i);
                    String job = crewMember.getString("job");
                    String name = crewMember.getString("name");

                    if ("Director".equalsIgnoreCase(job)) {
                        directors.put(name); // Add director's name
                    } else if ("Writer".equalsIgnoreCase(job) || "Screenplay".equalsIgnoreCase(job)
                            || "Story".equalsIgnoreCase(job)) {
                        writers.put(name); // Add writer's name
                    }
                }

                // Add directors & writers to movie details
                movieDetails.put("directors", directors);
                movieDetails.put("writers", writers);

                // Fetch movie trailers (videos)
                String videoUrl = BASE_URL + "/movie/" + movieId + "/videos?api_key=" + API_KEY;
                String videoResponse = restTemplate.getForObject(videoUrl, String.class);

                if (videoResponse != null) {
                    JSONObject videoRoot = new JSONObject(videoResponse);
                    JSONArray videos = videoRoot.getJSONArray("results");

                    // Filter out only YouTube trailers
                    JSONArray trailers = new JSONArray();
                    for (int i = 0; i < videos.length(); i++) {
                        JSONObject video = videos.getJSONObject(i);
                        if ("Trailer".equals(video.getString("type")) && "YouTube".equals(video.getString("site"))) {
                            trailers.put(video);
                        }
                    }

                    // Add trailers to movie details
                    movieDetails.put("trailers", trailers);
                }

                return movieDetails;
            } else {
                System.out.println("Movie not found: " + movieId);
                return new JSONObject().put("error", "Movie not found");
            }
        } catch (Exception e) {
            System.out.println("Error fetching movie details: " + e.getMessage());
            return new JSONObject().put("error", "Failed to fetch movie details");
        }
    }
}

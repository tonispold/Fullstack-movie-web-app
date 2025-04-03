import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom"; // Use React Router Link

interface Movie {
  id: number; // ✅ Added id
  title: string;
  posterPath: string;
  overview: string;
  runtime: number;
  releaseDate: string;
  voteAverage: number;
}

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:8080/api/movies/popular?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies((prevMovies) => {
          if (page === 1) {
            return data;
          } else {
            const newMovies = data.filter(
              (newMovie: Movie) =>
                !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id) // ✅ Use id instead of title
            );
            return [...prevMovies, ...newMovies];
          }
        });
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, [page]);

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Popular Movies
      </Typography>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={movie.id}>
            <Link
              to={`/movies/${movie.id}`} // ✅ Use React Router Link properly
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.overview.length > 100
                      ? movie.overview.substring(0, 100) + "..."
                      : movie.overview}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Duration:</strong> {movie.runtime} min
                  </Typography>
                  <Typography variant="body2">
                    <strong>Release Date:</strong> {movie.releaseDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Rating:</strong> {movie.voteAverage}/10
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setPage(page + 1)}
        sx={{ display: "block", margin: "20px auto" }}
      >
        Load More
      </Button>
    </Container>
  );
};

export default Movies;

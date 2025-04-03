import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import unknown from "../assets/unknown.jpg";
import { Box, Container, Grid, Typography, Button } from "@mui/material";

interface MovieDetails {
  title: string;
  poster_path: string;
  backdrop_path: string;
  tagline: string;
  overview: string;
  runtime: number;
  release_date: string;
  vote_average: number;
  genres: string[];
  cast: { name: string; profilePath: string | null }[];
  directors: string[];
  writers: string[];
  trailers: { key: string; name: string; site: string }[];
  status: string;
  original_language: string;
  production_countries: { name: string }[];
}

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [showAllCast, setShowAllCast] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/movies/details/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  const visibleCast = showAllCast ? movie.cast : movie.cast?.slice(0, 10) || [];

  return (
    <Container sx={{ maxWidth: "lg", mt: 5 }}>
      <Container
        sx={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(to right, rgba(31.5, 31.5, 52.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 31.5, 52.5, 0.84) 50%, rgba(31.5, 31.5, 52.5, 0.84) 100%), url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 20px 20px",
          borderRadius: "8px",
          color: "white",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 300,
            height: 450,
            backgroundImage: movie.poster_path
              ? `url(https://image.tmdb.org/t/p/w1280${movie.poster_path})`
              : undefined,
            backgroundSize: "cover",
          }}
        ></Box>
      </Container>
      <Box>
        <Typography sx={{ my: 2 }} variant="h3">
          {movie.title}
        </Typography>
        <Typography sx={{ mb: 1 }} variant="h5">
          {movie.tagline}
        </Typography>
        <Typography variant="h6">{movie.overview}</Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
          Information
        </Typography>
        <Typography variant="body1">
          <strong>Duration:</strong> {movie.runtime} min
        </Typography>
        <Typography variant="body1">
          <strong>Release Date:</strong> {movie.release_date}
        </Typography>
        <Typography variant="body1">
          <strong>Rating:</strong> {movie.vote_average}/10
        </Typography>
        <Typography variant="body1">
          <strong>Genres:</strong> {movie.genres?.join(", ") || "Unknown"}
        </Typography>
        <Typography variant="body1">
          <strong>Directors:</strong> {movie.directors?.join(", ") || "Unknown"}
        </Typography>
        <Typography variant="body1">
          <strong>Writers:</strong> {movie.writers?.join(", ") || "Unknown"}
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h5">Additional Information</Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {movie.status}
        </Typography>
        <Typography variant="body1">
          <strong>Language:</strong> {movie.original_language}
        </Typography>
        <Typography variant="body1">
          <strong>Production Countries:</strong>{" "}
          {movie.production_countries
            .map((country) => country.name)
            .join(", ") || "Unknown"}
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ mt: 3 }}>
        Cast Members
      </Typography>
      <Grid container spacing={2}>
        {visibleCast.map((member, index) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Box
                component="img"
                src={
                  member.profilePath
                    ? `https://image.tmdb.org/t/p/w200${member.profilePath}`
                    : unknown
                }
                alt={member.name}
                sx={{
                  borderRadius: "8px",
                  height: "200px",
                  width: "auto",
                  objectFit: "cover",
                }}
              />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {member.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {movie.cast.length > 10 && (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setShowAllCast(!showAllCast)}
        >
          {showAllCast ? "Show Less" : "View More"}
        </Button>
      )}
    </Container>
  );
};

export default MovieDetails;

import { apiPath } from "../config/env";
import type { Movie } from "../types/movie";

// Backend movie shape (partial)
type ApiMovie = {
  _id: string;
  title: string;
  shortDescription?: string;
  poster: string;
  backdrop?: string;
  genre?: string[];
  year?: number;
  rating?: number;
  duration?: number;
  trailer?: string;
};

// Map API movie to UI Movie type expected by carousels/components
const mapToUIMovie = (m: ApiMovie): Movie => {
  const thumb = m.poster;
  const bg = m.backdrop || m.poster;
  return {
    id: m._id,
    title: m.title,
    titleImage: m.poster, // we don't have a separate title image; reuse poster
    backgroundImage: bg,
    thumbnailImage: thumb,
    trailer: m.trailer,
    alt: m.title,
    year: m.year,
    rating: m.rating,
    duration: m.duration ? `${m.duration} min` : undefined,
    genre: Array.isArray(m.genre) ? m.genre.join(", ") : undefined,
    description: m.shortDescription,
  };
};

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchFeaturedMovies(limit = 6): Promise<Movie[]> {
  const res = await fetch(apiPath(`/api/movies/featured?limit=${limit}`), {
    headers: {
      ...authHeaders(),
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load featured movies");
  const data = await res.json();
  const list: ApiMovie[] = data.movies || [];
  return list.map(mapToUIMovie);
}

export async function fetchMovies(params?: {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<{ movies: Movie[]; pagination?: any }> {
  const qp = new URLSearchParams();
  if (params?.page) qp.set("page", String(params.page));
  if (params?.limit) qp.set("limit", String(params.limit));
  if (params?.genre) qp.set("genre", params.genre);
  if (params?.search) qp.set("search", params.search);
  if (params?.sortBy) qp.set("sortBy", params.sortBy);
  if (params?.sortOrder) qp.set("sortOrder", params.sortOrder);
  const qs = qp.toString();
  const url = apiPath(`/api/movies${qs ? `?${qs}` : ""}`);
  const res = await fetch(url, {
    headers: {
      ...authHeaders(),
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load movies");
  const data = await res.json();
  const list: ApiMovie[] = data.movies || [];
  return { movies: list.map(mapToUIMovie), pagination: data.pagination };
}

export async function fetchMovieById(id: string): Promise<Movie | null> {
  const res = await fetch(apiPath(`/api/movies/${id}`), {
    headers: {
      ...authHeaders(),
    },
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  const apiMovie: ApiMovie | undefined = data.movie;
  return apiMovie ? mapToUIMovie(apiMovie) : null;
}

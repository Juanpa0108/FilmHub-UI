// src/types/movie.ts
// src/types/movie.ts
export type Movie = {
  id: string | number;
  title: string;
  titleImage: string;
  backgroundImage: string;
  thumbnailImage: string; // ← obligatorio
  alt?: string;
  year?: string | number;
  rating?: string | number;
  duration?: string;
  genre?: string;
  description?: string;
};

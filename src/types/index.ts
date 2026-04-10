export interface Game {
  id: string;
  title: string;
  price: string | number;
  genre: string;
  platform: string;
  rating: string | number;
  publisher: string;
  releaseDate: string;
  description: string;
  image?: string;
  trailer?: string;
  tags?: string[];
  slug?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: string | number;
  image?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  [key: string]: any;
}

export interface GamesResponse {
  success: boolean;
  games: Game[];
  total: number;
}

export interface StatsResponse {
  success: boolean;
  total: number;
  genres: string[];
  platforms: string[];
}

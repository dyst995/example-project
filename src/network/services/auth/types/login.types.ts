export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  refreshToken: string;
  accessToken: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

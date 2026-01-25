// S3 Storage Configuration
export const S3_CONFIG = {
  GAME_IMAGES_BUCKET: 'switchboard-dev-game-images',
  REGION: 'eu-west-1',
  BASE_URL: 'https://switchboard-dev-game-images.s3.eu-west-1.amazonaws.com',
};

// Helper function to get full S3 URL for a game image
export const getGameImageUrl = (filename: string): string => {
  return `${S3_CONFIG.BASE_URL}/games/${filename}`;
};

// Helper to extract filename from local import path
export const getFilenameFromPath = (path: string): string => {
  return path.split('/').pop() || '';
};

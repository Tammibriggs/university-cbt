export const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  return `${minutes}`;
}

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
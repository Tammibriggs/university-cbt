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

export const todaysDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  return `${mm} : ${dd} : ${yyyy}`;
};
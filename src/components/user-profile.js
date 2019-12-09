const determimeLevel = (movieCount) => {
  if (movieCount <= 10) {
    return `Novice`;
  }
  if (movieCount <= 20) {
    return `Fan`;
  }

  return `Movie Buff`;
};

export const createUserProfileTemplate = (movieCount) => {
  const userLevel = determimeLevel(movieCount);

  return (
    `<section class="header__profile profile">
    ${movieCount !== 0 ? `<p class="profile__rating">${userLevel}</p>` : ``}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  );
};

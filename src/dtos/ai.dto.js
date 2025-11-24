export const bodyToAI = (body) => {
  return {
    message: body.message,
  };
};

export const responseFromAI = ({ ai }) => {
  return {
    type: ai.type,
    reply: ai.reply,
  };
};

export const requestForWeatherKeyword = (user, weather) => {
  return {
    user: user,
    weather: weather,
  };
};

export const responseFromKeywords = ({ user, dailyCloths }) => {
  return {
    user: {
      userId: user.id,
    },
    keywords: dailyCloths[0].ClothKeywords.map((cloth) => cloth.keyword),
  };
};

export const responseFromKeywordImages = ({ user, images }) => {
  return {
    user: {
      userId: user.id,
    },
    images: images.map((img) => img.imageUrl),
  };
};

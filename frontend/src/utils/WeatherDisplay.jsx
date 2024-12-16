const WeatherDisplay = ({ weather }) => {
  const getWeatherInJapanese = (weather) => {
    switch (weather) {
      case 'sunny':
        return '晴れ';
      case 'cloudy':
        return '曇り';
      case 'rainy':
        return '雨';
      case 'stormy':
        return '嵐';
      case 'snowy':
        return '雪';
      default:
        return '不明';
    }
  };

  return (
    <p>
      {getWeatherInJapanese(weather)}
    </p>
  );
};

export default WeatherDisplay;
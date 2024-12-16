const FishingTypeDisplay = ({ fishingType }) => {
  const getFishingTypeInJapanese = (fishingType) => {
    switch (fishingType) {
      case 'floatFishing':
        return 'フカセ釣り';
      case 'lure':
        return 'ルアー';
      case 'casting':
        return '打ち込み';
      default:
        return '';
    }
  };

  return (
    <p>
      {getFishingTypeInJapanese(fishingType)}
    </p>
  );
};

export default FishingTypeDisplay;
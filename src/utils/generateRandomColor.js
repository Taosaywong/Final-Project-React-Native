const generateRandomColor = (datalength) => {
    return Array.from({ length: datalength }, () => {
      const hex = Math.floor(Math.random() * 16777215).toString(16);
      return `#${hex.length === 6 ? hex : "0".repeat(6 - hex.length) + hex}`;
    });
  };

export default generateRandomColor;

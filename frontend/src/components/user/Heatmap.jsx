import React from "react";
import HeatMap from "@uiw/react-heat-map";

const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

const getPanelColor = (maxCount) => {
  const colors = {};
  for (i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor(i / maxCount) * 255;
    colors[i] = `rgb(0,${greenValue},0)`;
  }
  return colors;
};

const HeatMapProfile = () => {};

export default Heatmap;

import { useState } from "react";

import "./colorPicker.css";

const INITIAL_COLORS = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

function ColorDot(props) {
  function setPlayerColor() {
    // Why does this not work?
    // props.setPlayerColors(
    //   [...props.playerColors].splice(
    //     props.currentPlayerColorIndex,
    //     1,
    //     props.color
    //   )
    // );

    const newPlayerColors = [...props.playerColors];
    newPlayerColors.splice(props.currentPlayerColorIndex, 1, props.color);
    props.setPlayerColors(newPlayerColors);
  }

  function enableDisableColors(enableColor) {
    const newDisabledColors = [...props.disabledColors];

    // Enable previous color (if applicable)
    const enableColorIndex = INITIAL_COLORS.indexOf(enableColor);
    if (enableColorIndex > -1) {
      newDisabledColors[enableColorIndex] = false;
    }

    // Disable current color
    newDisabledColors[props.index] = true;

    props.setDisabledColors(newDisabledColors);
  }

  function handleColorDotClick() {
    if (!props.disabled && props.currentPlayerColorIndex !== null) {
      const prevColor = props.playerColors[props.currentPlayerColorIndex];

      setPlayerColor();

      enableDisableColors(prevColor);
    }
  }

  return (
    <span
      className={
        "color-picker-dot" + (props.disabled ? " disabled-color-dot" : "")
      }
      style={{ backgroundColor: props.color }}
      onClick={handleColorDotClick}
    ></span>
  );
}

function ColorPicker(props) {
  const [disabledColors, setDisabledColors] = useState(
    Array(INITIAL_COLORS.length).fill(false)
  );

  return (
    <div className="color-picker">
      {INITIAL_COLORS.map((color, index) => (
        <ColorDot
          color={color}
          currentPlayerColorIndex={props.currentPlayerColorIndex}
          disabled={disabledColors[index]}
          disabledColors={disabledColors}
          index={index}
          key={index}
          playerColors={props.playerColors}
          setDisabledColors={setDisabledColors}
          setPlayerColors={props.setPlayerColors}
        />
      ))}
    </div>
  );
}

export default ColorPicker;

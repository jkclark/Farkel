import { INITIAL_COLORS } from "../constants";
import dieIcon from "../img/dice-5.svg";

import "./colorPicker.css";

export function RandomizeColorsButton(props) {
  // Taken from: https://stackoverflow.com/a/2450976/3801865
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  function randomizePlayerColors() {
    // Get colors to use randomly from color array
    const shuffledColors = shuffle([...INITIAL_COLORS]).slice(
      0,
      props.playerColors.length
    );

    // Give each player a random color
    props.setPlayerColors(shuffledColors);

    // Mark used colors as disabled
    const newDisabledColors = Array(INITIAL_COLORS.length).fill(false);
    shuffledColors.forEach((color) => {
      newDisabledColors[INITIAL_COLORS.indexOf(color)] = true;
    });
    props.setDisabledColors(newDisabledColors);
  }

  return (
    <img
      src={dieIcon}
      className="randomize-colors-icon"
      onClick={randomizePlayerColors}
      alt="Randomize"
    ></img>
  );
}

function ColorDot(props) {
  function setPlayerColor() {
    // TODO: Look into React usereducer to handle this complex state update
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
      className={"color-dot" + (props.disabled ? " disabled-color-dot" : "")}
      style={{ backgroundColor: props.color }}
      onClick={handleColorDotClick}
    ></span>
  );
}

function ColorPicker(props) {
  return (
    <div className="color-picker">
      {INITIAL_COLORS.map((color, index) => (
        <ColorDot
          color={color}
          currentPlayerColorIndex={props.currentPlayerColorIndex}
          disabled={props.disabledColors[index]}
          disabledColors={props.disabledColors}
          index={index}
          key={index}
          playerColors={props.playerColors}
          setDisabledColors={props.setDisabledColors}
          setPlayerColors={props.setPlayerColors}
        />
      ))}
    </div>
  );
}

export default ColorPicker;

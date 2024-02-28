import React from 'react';
import styles from './styles.module.css';

const Colors = Object.freeze({
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  PURPLE: 'purple',
  CYAN: 'cyan',
  MAGENTA: 'magenta',
  TEAL: 'teal',
  PINK: 'pink',
});

const ColorSelect = React.forwardRef((props, ref) => {
  return (
    <select
      id="colorSelect"
      className={`${styles.selectDropdown} ${props.class}`}
      ref={ref}

      defaultValue="null"
      {...props}
    >
      <option value="null"
        disabled={props.null_disabled}>
        Select Color
      </option>
      
      {Object.keys(Colors).map((colorKey) => (
        <option key={Colors[colorKey]} value={Colors[colorKey]}>
          {Colors[colorKey].charAt(0).toUpperCase() +
            Colors[colorKey].slice(1)}
        </option>
      ))}
    </select>
  );
});

export default ColorSelect;

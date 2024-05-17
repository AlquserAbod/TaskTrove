import React from 'react'
import Select from 'react-select';
import styles from './styles.module.css';

export const Colors = [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" },
    { value: "orange", label: "Orange" },
    { value: "purple", label: "Purple" },
    { value: "cyan", label: "Cyan" },
    { value: "magenta", label: "Magenta" },
    { value: "teal", label: "Teal" },
    { value: "pink", label: "Pink" }
]


const formatOptionLabel = ({ value, label }) => (
    <div className={styles.optionContainer}>
      <div className={styles.optionColorCircle} style={{background: value}}>
      </div>
      <div>{label}</div>
    </div>
  );



const ColorSelect = (props) => {
    return (
        <Select
            {...props}
            options={Colors}
            formatOptionLabel={formatOptionLabel}
            onChange={props.onChange}
        />
    );
}


export default ColorSelect

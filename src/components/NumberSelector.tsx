import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface NumberSelectorWithControlsProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

const NumberSelector: React.FC<NumberSelectorWithControlsProps> = ({
  value,
  onChange,
  min = 1,
  max = 100,
  label,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(event.target.value, 10);
    if (!isNaN(val)) {
      onChange(Math.max(min, Math.min(max, val)));
    }
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton onClick={decrement} disabled={value <= min}>
        <RemoveIcon />
      </IconButton>

      <TextField
        label={label}
        value={value}
        onChange={handleInputChange}
        slotProps={{
          input: {
            inputMode: "numeric",
          },
        }}
      />

      <IconButton onClick={increment} disabled={value >= max}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default NumberSelector;

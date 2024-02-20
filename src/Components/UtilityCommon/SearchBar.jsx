import React from "react";
import TextField from "@mui/material/TextField";

function SearchBar({ value, onChange,onSearchClick }) {
  return (
    <div className="controls">
      <TextField
        id="search"
        label="Enter Title"
        variant="outlined"
        value={value}
        onChange={onChange}
        placeholder="Search by millshortname.."
        onClick={onSearchClick} 
        style={{"float":"right",  "borderRadius": "25px"}}
      />
    </div>
  );
}

export default SearchBar;
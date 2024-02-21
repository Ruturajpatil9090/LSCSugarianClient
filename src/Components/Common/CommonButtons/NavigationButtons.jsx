import React from 'react';

const NavigationButtons = ({
  handleFirstButtonClick,
  handlePreviousButtonClick,
  handleNextButtonClick,
  handleLastButtonClick,
  highlightedButton,
  isEditing
}) => {
  return (
    <div style={{ float: "right", marginTop: "-40px" }}>
      <button
        style={{
          border: "1px solid #ccc",
          backgroundColor: highlightedButton === "first" ? "black" : "blue",
          color: "white",
          width: "100px",
          height: "35px",
          cursor: isEditing ? "not-allowed" : "pointer",
        }}
        onClick={() => handleFirstButtonClick()}
        disabled={isEditing}
      >
        &lt;&lt;
      </button>
      <button
        style={{
          border: "1px solid #ccc",
          backgroundColor: highlightedButton === "previous" ? "black" : "blue",
          color: "white",
          width: "100px",
          height: "35px",
          cursor: isEditing ? "not-allowed" : "pointer",
        }}
        onClick={() => handlePreviousButtonClick()}
        disabled={isEditing}
      >
        &lt;
      </button>
      <button
        style={{
          border: "1px solid #ccc",
          backgroundColor: highlightedButton === "next" ? "black" : "blue",
          color: "white",
          width: "100px",
          height: "35px",
          cursor: isEditing ? "not-allowed" : "pointer",
        }}
        onClick={() => handleNextButtonClick()}
        disabled={isEditing}
      >
        &gt;
      </button>
      <button
        style={{
          border: "1px solid #ccc",
          backgroundColor: highlightedButton === "last" ? "black" : "blue",
          color: "white",
          width: "100px",
          height: "35px",
          cursor: isEditing ? "not-allowed" : "pointer",
        }}
        onClick={() => handleLastButtonClick()}
        disabled={isEditing}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default NavigationButtons;

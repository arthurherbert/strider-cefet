import React from "react";
import "./spinner-container.css";

export const SpinnerContainer = ({ isLoading = false }) => {
  return (
    isLoading && (
      <div className="spinner-container">
        <div>
          <div className="lds-ring">
            <div />
            <div />
            <div />
            <div />
          </div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  );
};

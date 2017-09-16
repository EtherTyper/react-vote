import React from "react";
import "./App.css";

export function formatRole(role) {
  const spacedRole = role.replace(/([A-Z])/g, " $1");
  const capitalizedRole =
    spacedRole.charAt(0).toUpperCase() + spacedRole.slice(1);
}

export const host = process.env.PRODUCTION
  ? "https://react-vote-server.herokuapp.com"
  : "http://127.0.0.1:5000";
export const nameChecker = /^[A-Z][A-Za-z]+[A-Z]$/m;

class ApplicationPage extends React.Component {
  errorMessage(message) {
    this.setState({
      applicationError: message,
      applicationSuccess: undefined
    });
  }

  successMessage(message) {
    this.setState({
      applicationSuccess: message,
      applicationError: undefined
    });
  }
}

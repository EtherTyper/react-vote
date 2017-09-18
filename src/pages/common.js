import React from "react";

export function formatRole(role) {
  const spacedRole = role.replace(/([A-Z])/g, " $1");
  const capitalizedRole =
    spacedRole.charAt(0).toUpperCase() + spacedRole.slice(1);

  return capitalizedRole;
}

export const host = "https://react-vote-server.herokuapp.com";
export const nameChecker = /^[A-Z][A-Za-z]+[A-Z]$/m;

export const RolePicker = ({ role, onChange }) => (
  <select name="role" value={role} onChange={onChange}>
    <option value="president">President</option>
    <option value="vicePresident">Vice President</option>
    <option value="secretary">Secretary</option>
    <option value="treasurer">Treasurer</option>
    <option value="librarian">Librarian</option>
  </select>
);

export class ApplicationPage extends React.Component {
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

  handleEvent(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      applicationError: undefined
    });
  }
}

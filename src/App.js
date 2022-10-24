import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useNavigate } from 'react-router-dom';
import { gql } from 'apollo-boost';
import './App.css';

const ALL_USERS_QUERY = gql`
  query {
    allUsers {
      email
      name
      role
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUsers($emails: [ID]!) {
    deleteUsers(emails: $emails)
  }
`;

// Leaving in reset functionality for convenience
const RESET_USERS = gql`
  mutation resetUsers {
    resetUsers
  }
`;

const App = () => {
  let disableContinue = true;
  const [reset] = useMutation(RESET_USERS);
  const [deleteUsers] = useMutation(DELETE_USER);
  const { loading, error, data } = useQuery(ALL_USERS_QUERY);

  // Nav to 'details' on row click with email to retrieve user
  const navigate = useNavigate();
  const handleRowClick = (email) => {
    navigate('./Details', { state: { userEmail: email } });
  };

  // Set value of selected checkbox
  const [checkedUserEmail, setCheckedUserEmail] = useState([]);
  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCheckedUserEmail([...checkedUserEmail, value]);
    } else {
      setCheckedUserEmail(checkedUserEmail.filter((e) => e !== value));
    }
  };

  // Disable/enable delete button based on checked state of checkboxes
  if (document.querySelectorAll('input[type=checkbox]:checked').length > 0) {
    disableContinue = false;
  } else {
    disableContinue = true;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  return (
    <div>
      <div id='main'>
        <h1>Users</h1>
        <button
          id='deleteButton'
          disabled={disableContinue}
          onClick={() => {
            deleteUsers({ variables: { emails: checkedUserEmail } });
          }}
        >
          Delete
        </button>
      </div>
      <table id='usersTable'>
        <thead>
          <tr>
            <th></th>
            <th>EMAIL</th>
            <th>NAME</th>
            <th>ROLE</th>
          </tr>
        </thead>
        <tbody>
          {data.allUsers.map(({ email, name, role }) => (
            <tr key={email}>
              <td>
                <input type='checkbox' value={email} onChange={(e) => handleCheckbox(e)}></input>
              </td>
              <td onClick={() => handleRowClick({ email })}>{email}</td>
              <td onClick={() => handleRowClick({ email })}>{name}</td>
              <td onClick={() => handleRowClick({ email })}>{role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
      disabled
        onClick={() => {
          reset();
        }}
      >
        Reset Users
      </button>
    </div>
  );
};

export default App;

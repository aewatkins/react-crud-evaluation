import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useLocation } from 'react-router-dom';
import { gql } from 'apollo-boost';
import './Details.css';

const USER_QUERY = gql`
  query user($email: ID!) {
    user(email: $email) {
      email
      name
      role
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($email: ID!, $newAttributes: UserAttributesInput!) {
    updateUser(email: $email, newAttributes: $newAttributes) {
      name
      role
    }
  }
`;

const Details = () => {
  const { state } = useLocation();
  const { userEmail } = state;
  const [role, setRole] = useState('');
  const nameRef = React.useRef();

  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: {
      email: userEmail.email,
    },
  });

  const [updateUser] = useMutation(UPDATE_USER);
  const onChangeValue = (event) => {
    setRole(event.target.value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUser({
            variables: {
              email: data.user.email,
              newAttributes: {
                name: nameRef.current.value,
                role: role,
              },
            },
          });
        }}
      >
        <div id='header'>
          <h1>{data.user.email}</h1>
          <button type='submit' id='saveButton'>
            Save
          </button>
        </div>
        <div className='row'>
          <div className='column' id='nameColumn'>
            <label htmlFor='name'>Name</label>
            <br />
            <input id='name' type='text' ref={nameRef} defaultValue={data.user.name} />
          </div>
          <div className='column'>
            <ul className='no-bullets'>
              <label htmlFor='role'>Role</label>
              <li>
                <label className='container'>
                  <input
                    type='radio'
                    value='ADMIN'
                    onChange={onChangeValue}
                    name='role'
                    checked={role === 'ADMIN'}
                  />
                  Admin
                </label>
              </li>
              <li>
                <input
                  type='radio'
                  value='DEVELOPER'
                  onChange={onChangeValue}
                  name='role'
                  checked={role === 'DEVELOPER'}
                />
                Developer
              </li>
              <li>
                <input
                  type='radio'
                  value='APP_MANAGER'
                  onChange={onChangeValue}
                  name='role'
                  checked={role === 'APP_MANAGER'}
                />
                App Manager
              </li>
              <li>
                <input
                  type='radio'
                  value='MARKETING'
                  onChange={onChangeValue}
                  name='role'
                  checked={role === 'MARKETING'}
                />
                Marketing
              </li>
              <li>
                <input
                  type='radio'
                  value='SALES'
                  onChange={onChangeValue}
                  name='role'
                  checked={role === 'SALES'}
                />
                Sales
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Details;

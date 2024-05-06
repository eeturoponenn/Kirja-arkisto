import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import BackgroundImage from '../assets/background.jpg';
import '../styles/Kirjaudu.css';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { login } from "../actions/auth";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert" data-testid="alert">
        Tämä kenttä ei saa olla tyhjä!
      </div>
    );
  }
};

function Kirjaudu () {

  let navigate = useNavigate();

  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);

  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(login(username, password))
        .then(() => {
          navigate("/kirjasto");
          window.location.reload();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/kirjasto" />;
  }

    return (
        <div className='frontpage'  >
          <div className='leftSide' style={{backgroundImage: `url(${BackgroundImage})`}}>
              <h1> Kirja-Arkisto</h1>
          </div>
        <div className="rightSide">
          <div className="login-form">
            <h1 className="login-title"> Kirjaudu sisään</h1>
          <Form onSubmit={handleLogin} ref={form}>
              <label htmlFor="username">Käyttäjätunnus</label>
              <Input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={onChangeUsername}
                validations={[required]}
              />

              <label htmlFor="password">Salasana</label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChangePassword}
                validations={[required]}
              />

              <button disabled={loading} data-testid="login">
                {loading && (
                  <span></span>
                )}
                <span>Kirjaudu</span>
              </button>

            {message && (
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
            )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
          </div>
        </div>
      </div>
    )
}


export default Kirjaudu;
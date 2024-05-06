import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import BackgroundImage from '../assets/background.jpg';
import '../styles/Kirjaudu.css';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import { register } from "../actions/auth";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Tämä kenttä ei saa olla tyhjä!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        Käyttämäsi sähköpostiosoite on virheellinen.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        Käyttäjänimen täytyy olla 3 - 20 merkkiä pitkä.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        Salasanan täytyy olla 6 - 40 merkkiä pitkä.
      </div>
    );
  }
};

function Rekisteroidy () {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(register(username, email, password))
        .then(() => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
        });
    }
  };

    return (
      <div className='frontpage'  >
            <div className='leftSide' style={{backgroundImage: `url(${BackgroundImage})`}}>
                <h1> Kirja-Arkisto</h1>
            </div>
            <div className="rightSide">
              <div className="login-form">
                <h1 className="login-title">Rekisteröidy</h1>
              <Form onSubmit={handleRegister} ref={form}  data-testid="submit-button">
                {!successful && (
                  <div>
                    <label htmlFor="username">Käyttäjätunnus</label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={onChangeUsername}
                      validations={[required, vusername]}
                    />

                    <label htmlFor="email">Sähköposti</label>
                    <Input
                      type="text"
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChangeEmail}
                      validations={[required, validEmail]}
                    />

                    <label htmlFor="password">Salasana</label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={onChangePassword}
                      validations={[required, vpassword]}
                    />
                    <button data-testid="submit">Rekisteröidy</button>
                  </div>
                )}


                {message && (
                  <div className="form-group">
                    <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                      {message}
                    </div>
                  </div>
                )}
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
              </Form>
              </div>
            </div>
          </div>
      )
}


export default Rekisteroidy
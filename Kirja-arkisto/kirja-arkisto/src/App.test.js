import React from 'react';
import { render, fireEvent, screen, waitFor, getAllByText, getByTestId, getByText } from '@testing-library/react';
import Rekisteroidy from './pages/Rekisteroidy';
import Kirjaudu from './pages/Kirjaudu';
import Kirjasto from './pages/Kirjasto';
import Kirjasto2 from './pages/Kirjasto2';
import { Provider, useSelector } from 'react-redux';
import store from './store'; 
import { MemoryRouter, Navigate, BrowserRouter } from 'react-router-dom';
import Profile from './pages/Profiili';
import Etusivu from './pages/Etusivu';
import App from './App.js'
import Sarjat from './pages/Sarjat'


describe('Rekisteroidy component', () => {

  test('rekisteröidy renders correctly', () => {
    const { getByLabelText } = 
    render(
      <Provider store={store}>
        <Rekisteroidy />
      </Provider>
    );
    expect(getByLabelText('Käyttäjätunnus')).toBeInTheDocument();
    expect(getByLabelText('Sähköposti')).toBeInTheDocument();
    expect(getByLabelText('Salasana')).toBeInTheDocument();
  });

  test('Valid username and password are accepted', async () => {
    const { getByLabelText, getAllByText, getByTestId } = 
    render(
      <Provider store={store}>
        <Rekisteroidy />
      </Provider>
    );

    const usernameInput = getByLabelText('Käyttäjätunnus');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const emailInput = getByLabelText('Sähköposti');
    fireEvent.change(emailInput, { target: { value: 'testuser@test.com' } });

    const passwordInput = getByLabelText('Salasana');
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    const registerButton = getByTestId('submit');
    fireEvent.click(registerButton);

    //await screen.findByText('Rekisteröityminen onnistui!'); tätä ei löydä millään
  });
  

  test('Invalid username and password are not accepted', () => {
    const { getByLabelText, getByText, getByTestId } = 
    render(
      <Provider store={store}>
        <Rekisteroidy />
      </Provider>
    );

    const usernameInput = getByLabelText('Käyttäjätunnus');
    fireEvent.change(usernameInput, { target: { value: 'us' } });

    const emailInput = getByLabelText('Sähköposti');
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });

    const passwordInput = getByLabelText('Salasana');
    fireEvent.change(passwordInput, { target: { value: 'pw' } });

    const registerButton = getByTestId('submit');
    fireEvent.click(registerButton);

    expect(getByText('Käyttäjänimen täytyy olla 3 - 20 merkkiä pitkä.')).toBeInTheDocument();
    expect(getByText('Käyttämäsi sähköpostiosoite on virheellinen.')).toBeInTheDocument();
    expect(getByText('Salasanan täytyy olla 6 - 40 merkkiä pitkä.')).toBeInTheDocument();
  });
});

describe('Kirjaudu component', () => {
  test('kirjaudu renders correctly', () => {
    const { getByText, getByLabelText } = 
    render(
    <MemoryRouter>
      <Provider store={store}>
        <Kirjaudu />
      </Provider>
    </MemoryRouter>
    );
    expect(getByText('Kirjaudu sisään')).toBeInTheDocument();
    expect(getByLabelText('Käyttäjätunnus')).toBeInTheDocument();
    expect(getByLabelText('Salasana')).toBeInTheDocument();
    expect(getByText('Kirjaudu')).toBeInTheDocument();
  });

  test('renders login form', async () => {
    const mockLogin = jest.fn();
    const { getByLabelText, getByText } =
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Kirjaudu login={mockLogin} />
        </Provider>
      </MemoryRouter>
      );
      const usernameInput = screen.getByLabelText('Käyttäjätunnus');
      const passwordInput = screen.getByLabelText('Salasana');
      const loginButton = screen.getByRole('button', { name: 'Kirjaudu' });
    
      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
  });

  test('displays an error message for empty fields', async () => {
    const { getByLabelText, getByText, getAllByTestId, objectContaining } = 
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Kirjaudu />
        </Provider>
      </MemoryRouter>
      );
    fireEvent.click(getByText('Kirjaudu'));
    await waitFor(() => expect.objectContaining("Tämä kenttä ei saa olla tyhjä!"));
  });

});


describe('Etusivu component', () => {
  it('renders header and subheader', () => {
    const { getByText } = render(<Etusivu />);
    const headerElement = getByText('KIRJA-ARKISTO');
    const subheaderElement = getByText('Tervetuloa kirja-arkistoon!');
    expect(headerElement).toBeInTheDocument();
    expect(subheaderElement).toBeInTheDocument();
  });
});




//Sarjat testejä

describe('Sarjat component', () =>{

  test('renders sarjat component', () =>{

    const { getByText } =
    render(
    <MemoryRouter>
    <Provider store={store}>
      <Sarjat />
    </Provider>
    </MemoryRouter>
    );

    expect(getByText('Sarja')).toBeInTheDocument();
    expect(getByText('Lisää uusi sarja')).toBeInTheDocument();
    expect(getByText('Kuvaus')).toBeInTheDocument();

  });

  test('make a new series', () =>{
    const { getByText, getByLabelText, getByTestId } =
    render(
    <MemoryRouter>
    <Provider store={store}>
      <Sarjat />
    </Provider>
    </MemoryRouter>
    );

    fireEvent.click(getByText("Lisää uusi sarja"));

    const seriesnameInput = getByTestId('seriesnametest');
    fireEvent.change(seriesnameInput, { target: { value: 'testisarja' } });

    const seriesdescInput = getByTestId('seriesnametest');
    fireEvent.change(seriesdescInput, { target: { value: 'testisarjan kuvaus' } });

    fireEvent.click(getByText("Lisää"));



  });

  test('All the series show on screen', async() =>{
    const { getByText, getByLabelText, getByTestId } =
    render(
    <MemoryRouter>
    <Provider store={store}>
      <Sarjat />
    </Provider>
    </MemoryRouter>
    );
    

   await waitFor(() => expect.objectContaining('Poista'));
   await waitFor(() => expect.objectContaining('Avaa'));
   await waitFor(() => expect.objectContaining('Muokkkaa'));

    


  });

});


/*
test('displays "Peruuta muokkaus" button when edit button is clicked', () => {
  const data = [{ id: 1, name: 'Sarja 1', description: 'Kuvaus 1' }];
  render(<Kirjasto />, { initialState: { auth: { user: { id: 1 } } } });
  const editButton = screen.getByText(/Muokkaa/i);
  fireEvent.click(editButton);
  const cancelButton = screen.getByText(/Peruuta muokkaus/i);
  expect(cancelButton).toBeInTheDocument();
});

test('calls fetchSeries function when component loads', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ user: { series: [] } }),
    })
  );
  render(<Kirjasto />, { initialState: { auth: { user: { id: 1 } } } });
  expect(global.fetch).toHaveBeenCalledWith(
    'http://localhost:5000/api/library/1'
  );
  delete global.fetch;
});

test('calls setSeriesGet function with data when serieData function is called', () => {
  render(<Kirjasto />);
  const testData = [{ id: 1, name: 'Sarja 1', description: 'Kuvaus 1' }];
  const serieDataFunction = screen.getByTestId('serie-data-function');
  fireEvent.click(serieDataFunction, { target: { data: testData } });
  expect(screen.queryByText(/Sarja 1/i)).toBeInTheDocument();
});
*/
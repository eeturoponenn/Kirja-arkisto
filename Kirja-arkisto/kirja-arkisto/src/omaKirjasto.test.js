import React from 'react';
import { getAllByRole } from '@testing-library/dom';

import { render, fireEvent, screen, waitFor, getAllByText, getByTestId } from '@testing-library/react';
import Kirjasto from './pages/Kirjasto';
import { OwnSerieList } from './components/OwnSerieList';
import { Provider, useSelector } from 'react-redux';
import store from './store'; 
import { MemoryRouter, Navigate, BrowserRouter } from 'react-router-dom';
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
  }));

  
  describe('Omakirjasto component', () =>{
  
    test('renders Oma kirjasto properly.', async () =>{
      useSelector.mockReturnValue({ user: { id: 'mock-user-id' } }); // Mock currentUser
      const {getByLabelText, getByText, getAllByText, getAllByTestId, objectContaining} = 
        render(
          
      <MemoryRouter>
      <Provider store={store}>
          <Kirjasto/>
      </Provider>
      </MemoryRouter>
        
        
    );
    const SeriesHeader = getByText('Sarja');
    const DescHeader = getByText('Kuvaus');
  
      expect(SeriesHeader).toBeInTheDocument();
      expect(DescHeader).toBeInTheDocument();
  
  
    })
    test('Tuo uusi sarjas finds other series and their description', () =>{
      useSelector.mockReturnValue({ user: { id: 'mock-user-id' } }); // Mock currentUser
      const {getByLabelText, getByText, getAllByText, getByTestId, objectContaining} = 
        render(
          
      <MemoryRouter>
      <Provider store={store}>
          <Kirjasto/>
      </Provider>
      </MemoryRouter>
        
        
    );
    fireEvent.click(getByText('Tuo uusi sarja'));
    fireEvent.click(getByText('Valitse sarja'));
    fireEvent.change(getByTestId('selectbutton', { target: { value: 'Harry Potter' } }));
    expect.objectContaining('Velhopoika velhoileedsd');
    
    })
 
    
    test('displays "Peruuta lisääminen" button when "Tuo uusi sarja" button is clicked', () => {
        useSelector.mockReturnValue({ user: { id: 'mock-user-id' } }); // Mock currentUser
      render(
       
        <MemoryRouter>
        <Provider store={store}>
            <Kirjasto/>
        </Provider>
        </MemoryRouter>
       
      );
      const button = screen.getByText(/Tuo uusi sarja/i);
      fireEvent.click(button);
      const cancelButton = screen.getByText(/Peruuta tuominen/i);
      expect(cancelButton).toBeInTheDocument();
    });
});

// OwnSerieList

// mock useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

describe('OwnSerieList', () => {
    test('navigate to Kirjasto2 page on button click', () => {
      // set up mock navigate function
      const mockNavigate = jest.fn();
      require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  
      // set up props and data for component
      const data = [
        { name: 'Serie1', description: 'Description1', _id: '1' },
        { name: 'Serie2', description: 'Description2', _id: '2' },
      ];
      const props = {
        data: data,
        handleEdit: jest.fn(),
        serieData: jest.fn(),
      };
  
      // render component
      render(
      <OwnSerieList {...props} />
      );
  
      // simulate button click
      const buttons = screen.getAllByRole('button', { name: /avaa/i });
      const button = buttons[0]; // select the first button
      //const openButton = screen.getByRole('button', { name: /avaa/i, });
      //fireEvent.click(button);
      button.click();
  
      // check if navigate function was called with correct arguments
      expect(mockNavigate).toHaveBeenCalledWith('/kirjasto/Serie1/Description1/1');
    });

    test('should update a series', () => {
        // render the component
        render(<OwnSerieList />);
        
        // select the "Edit" button for the first series in the list
        const editButtons = screen.getAllByRole('button', { name: /Muokkaa/i });
        const editButton = editButtons[0];
      
        // click the "Edit" button
        fireEvent.click(editButton);
      
        // select the input field for the series title
        const titleInput = screen.getByLabelText('Sarjan nimi');
      
        // enter a new title for the series
        fireEvent.change(titleInput, { target: { value: 'New Series Title' } });
      
        // select the "Save" button
        const saveButton = screen.getByRole('button', { name: /Tallenna/i });
      
        // click the "Save" button
        fireEvent.click(saveButton);
      
        // assert that the series was updated
        const updatedTitle = screen.getByText('New Series Title');
        expect(updatedTitle).toBeInTheDocument();
      });
  });
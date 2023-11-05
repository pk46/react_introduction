import { useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "react-bootstrap/Navbar";
import {Container, Nav, NavbarOffcanvas, Offcanvas} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {mdiMoonNew, mdiPencilOutline, mdiWhiteBalanceSunny} from '@mdi/js';
import Icon from "@mdi/react";
import NewRecipeModalForm from "./bricks/NewRecipeModalForm";


function App() {

  const [showModal, setShowModal] = useState({
      state: false
  });
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate();
  const htmlElement = document.documentElement;

  const toggleDarkMode = () => {
      setDarkMode(!darkMode);
      htmlElement.setAttribute('data-bs-theme', darkMode ? 'light' : 'dark');
      };


  return (
      <div className="App">
          <Navbar
              fixed="top"
              variant="dark"
              bg="dark"
              expand="sm"
              className="mb-3"
              >
              <Container fluid>
                  <Navbar.Brand style={{cursor: "pointer"}} onClick={() => navigate("/")}>Receptář</Navbar.Brand>
                  <Navbar.Toggle id={"offcanvasNavbar-expad-sm"} />
                  <NavbarOffcanvas id={"offcanvasNavbar-expand-sm"}>
                      <Offcanvas.Header closeButton>
                          <Offcanvas.Title id={"offcanvasNavbarLabel-expand-sm"}>
                              Receptář
                          </Offcanvas.Title>
                      </Offcanvas.Header>
                      <Offcanvas.Body>
                          <Nav className="justify-content-end flex-grow-1 pe-3">
                              <Button onClick={() => navigate("/recipeList")} variant="primary">Recepty</Button>
                              <Button onClick={() => navigate("/ingredientList")} variant="primary"
                                      style={{marginLeft: 7}}>Ingredience</Button>
                              <Button onClick={() => setShowModal({state: true})} variant="success"
                                      style={{marginInline: 7}}>Nový recept</Button>
                              <Button onClick={toggleDarkMode} variant="secondary">
                                  {darkMode === false ?
                                  <Icon onClick={toggleDarkMode} path={mdiMoonNew} size={1} /> :
                                  <Icon path={mdiWhiteBalanceSunny} size={1} />}</Button>
                          </Nav>
                      </Offcanvas.Body>
                  </NavbarOffcanvas>
              </Container>
          </Navbar>
          <NewRecipeModalForm showModal={showModal.state} setShowModal={setShowModal} />
          <Outlet />
      </div>
  );
}

export default App;

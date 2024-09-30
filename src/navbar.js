import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="/">Stock App</Navbar.Brand>
    <Nav className="mr-auto">
      <LinkContainer to="/">
        <Nav.Link>Home</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/chatbot">
        <Nav.Link>AI Chatbot</Nav.Link>
      </LinkContainer>
    </Nav>
  </Navbar>
);

export default NavigationBar;

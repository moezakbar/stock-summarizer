import { Navbar, Nav } from 'react-bootstrap';

const NavigationBar = () => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">Stock App</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#features">AI Chatbot</Nav.Link>
    </Nav>
  </Navbar>
);

export default NavigationBar;

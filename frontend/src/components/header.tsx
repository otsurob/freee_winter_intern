import { useNavigate } from "react-router-dom";
import { Button, Container } from "@chakra-ui/react";

const Header = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Button onClick={() => navigate("/")}>トップ</Button>
    </Container>
  );
};

export default Header;

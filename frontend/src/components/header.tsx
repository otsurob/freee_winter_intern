import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const Header = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <Button onClick={() => navigate("/")}>トップ</Button>
    </Card>
  );
};

export default Header;

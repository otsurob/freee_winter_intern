import { useState, useEffect } from "react";
import { getCompanyName, getEmployees } from "../api/freeeApi";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Text,
} from "@chakra-ui/react";

interface Employee {
  id: number;
  display_name: string;
}

const StampingHome = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const name = await getCompanyName();
      const employeeData = await getEmployees();
      setCompanyName(name);
      setEmployees(employeeData);
    }
    fetchData();
  }, []);

  if (!companyName || !employees) return <div>Loading...!</div>;

  return (
    <Flex
      align="center"
      justify="center"
      h="100vh" /* 画面全体の高さを指定して中央寄せ */
    >
      <Container maxW="md" centerContent>
        {/* 事業所情報 */}
        <Box mb={8}>
          <Heading as="h2" size="lg" mb={4}>
            事業所情報
          </Heading>
          <Text>
            <strong>事業所名称:</strong> {companyName}
          </Text>
        </Box>

        {/* 従業員一覧 */}
        <Box mb={6} w="full">
          <Heading as="h3" size="md" mb={2}>
            従業員一覧
          </Heading>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>名前</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {employees.map((employee) => (
                <Table.Row key={employee.id}>
                  <Table.Cell>
                    <Button
                      onClick={() =>
                        navigate(`/owner/stamping?employeeId=${employee.id}`)
                      }
                    >
                      {employee.id}
                    </Button>
                  </Table.Cell>
                  <Table.Cell>{employee.display_name}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Container>
    </Flex>
  );
};

export default StampingHome;

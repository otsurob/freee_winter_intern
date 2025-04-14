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
import { Employee } from "@/types/types";
import Loading from "@/components/loading";

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

  function employeeClick(employeeId: string, employeeName: string) {
    if (window.confirm(`${employeeName}さんの打刻画面に移動しますか？`)) {
      navigate(
        `/owner/stamping?employeeId=${employeeId}&employeeName=${employeeName}`
      );
    }
  }

  if (!companyName || !employees) return <Loading />;

  return (
    <Flex align="center" justify="center" h="100vh">
      <Container maxW="md" centerContent>
        <Box mb={8}>
          <Heading as="h2" size="lg" mb={4}>
            事業所情報
          </Heading>
          <Text>
            <strong>事業所名称:</strong> {companyName}
          </Text>
        </Box>

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
                        employeeClick(employee.id, employee.display_name)
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
        <Button onClick={() => navigate("/owner")}>オーナー画面</Button>
      </Container>
    </Flex>
  );
};

export default StampingHome;

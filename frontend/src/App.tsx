// src/App.tsx
import { useState, useEffect } from "react";
import { getCompanyName, getEmployees } from "./api/freeeApi";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Flex,
  Box,
  Heading,
  Text,
  Table,
  Portal,
  Dialog,
  Input,
} from "@chakra-ui/react";
import Loading from "./components/loading";
import { Employee } from "./types/types";

function App() {
  const [companyName, setCompanyName] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
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
        `/stamping?employeeId=${employeeId}&employeeName=${employeeName}`
      );
    }
  }

  if (!companyName || !employees) return <Loading />;

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

        {/* ボタン類 */}
        <Box>
          <Button onClick={() => navigate("/calender")} mr={2}>
            カレンダー
          </Button>
          <Button onClick={() => setOpen(true)} mr={2}>
            オーナー画面
          </Button>
        </Box>
      </Container>
      <Portal>
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content className="sm:max-w-[425px]">
              <Dialog.Header>
                <Dialog.Title>オーナー画面にログイン</Dialog.Title>
                <Dialog.Description>
                  パスワードを入力してください
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <Input type="text"></Input>
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={() => navigate("/owner")}>ログイン</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Portal>
    </Flex>
  );
}

export default App;

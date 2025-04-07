import { getEmployees, getMonthSummary } from "@/api/freeeApi";
import Loading from "@/components/loading";
import { Employee, MonthWorkTime } from "@/types/types";
import { Box, Container, Flex, Heading, Input, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const CheckWorkTime = () => {
  // 従業員名を一覧で取得・表示
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workTimes, setWorkTimes] = useState<MonthWorkTime[]>([]);
  const [year, setYear] = useState(nowYear);
  const [month, setMonth] = useState(nowMonth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    async function fetchAllData() {
      const employeeData = await getEmployees();
      setEmployees(employeeData);

      const times = await Promise.all(
        employeeData.map(async (emp) => {
          const time = await getMonthSummary(emp.id, year, month);
          return {
            name: emp.display_name,
            workTime: time,
          };
        })
      );
      setWorkTimes(times);
      setIsLoading(false);
      console.log(month);
    }
    fetchAllData();
  }, [year, month]);

  if (isLoading || !employees || workTimes.length === 0) return <Loading />;

  function updateYearMonth(yearMonth: string) {
    const [nextYear, nextMonth] = yearMonth.split("-");
    setYear(parseInt(nextYear));
    setMonth(parseInt(nextMonth));
  }

  // 各従業員の出勤時間を表示

  // 月で切り替えられるようにするとgood デフォルトは当月

  return (
    <Flex
      align="center"
      justify="center"
      h="100vh" /* 画面全体の高さを指定して中央寄せ */
    >
      <Container maxW="md" centerContent>
        <Box mb={6} w="full">
          <Heading size="md" mb={2}>
            {year}年{month}月の総出勤時間
          </Heading>
          <Input
            type="month"
            value={`${String(year).padStart(4, "0")}-${String(month).padStart(
              2,
              "0"
            )}`}
            onChange={(e) => updateYearMonth(e.target.value)}
          />
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>名前</Table.ColumnHeader>
                <Table.ColumnHeader>時間</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {workTimes.map((workTime) => (
                <Table.Row key={workTime.name}>
                  <Table.Cell>{workTime.name}</Table.Cell>
                  <Table.Cell>
                    {Math.floor(workTime.workTime / 60)} 時間{" "}
                    {workTime.workTime % 60} 分
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Container>
    </Flex>
  );
};

export default CheckWorkTime;

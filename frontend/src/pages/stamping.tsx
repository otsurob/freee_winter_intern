import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEmployeeStatus, postStampingInfo, putShift } from "../api/freeeApi";

// Chakra UI から必要なコンポーネントをimport
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Field,
  NativeSelect,
  Flex,
} from "@chakra-ui/react";

enum EmployeeStatus {
  working = "出勤中",
  breaking = "休憩中",
  leaving = "退勤中",
  None = "未打刻",
}

const Stamping = () => {
  const [searchParams] = useSearchParams();
  const [available, setAvailable] = useState<string[]>([]);
  const employeeId = searchParams.get("employeeId");
  const [targetType, setTargetType] = useState<string>("clock_in");

  useEffect(() => {
    async function fetchData() {
      if (!employeeId) return;
      const availables = await getEmployeeStatus(employeeId);
      setAvailable(availables);
    }
    fetchData();
  }, [employeeId]);

  async function stamping() {
    if (!employeeId) {
      return;
    }
    if (!available.includes(targetType)) {
      // 警告toastを表示
      console.log("打刻種別が不正です");
      return;
    }
    console.log("打刻開始！");
    const datetime = new Date();
    // 日付をYYYY-MM-DD形式に変換
    const dateString = datetime.toISOString().split("T")[0];
    // 時刻をHH:MM形式に変換
    const timeString = datetime.toTimeString().slice(0, 5);
    const datetimeString = dateString + " " + timeString;
    const stampingResponse = await postStampingInfo(
      employeeId,
      datetimeString,
      targetType
    );
    console.log(stampingResponse);
  }

  let employeeStatus: string = "";
  if (available.length === 0) {
    return <div>Loading...</div>;
  }
  if (available[0] === "break_begin") {
    employeeStatus = EmployeeStatus.working;
  } else if (available[0] === "break_end") {
    employeeStatus = EmployeeStatus.breaking;
  } else if (available[0] === "clock_in" || available[0] === "clock_out") {
    employeeStatus = EmployeeStatus.leaving;
  } else {
    employeeStatus = EmployeeStatus.None;
  }

  const test2 = async () => {
    if (!employeeId) {
      return;
    }
    console.log("shift change");
    const id = await putShift(employeeId, "2025-03-26", "09:00", "18:00");
    console.log(id);
  };

  return (
    <Flex
      align="center"
      justify="center"
      h="100vh" /* 画面全体の高さを指定して中央寄せ */
    >
      <Card.Root maxW="md" w="full">
        <CardHeader>
          {/* shadcn/ui の CardTitle -> Chakra UI の Heading に変更 */}
          <Heading size="md">打刻ページ</Heading>
        </CardHeader>

        <CardBody>
          <Button onClick={stamping} colorScheme="blue" mb={4}>
            打刻する
          </Button>

          {/* Label + Select を Chakra UI の FormControl + FormLabel + Select に置き換え */}
          <Field.Root mb={4}>
            <Field.Label htmlFor="targetType">登録種別</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                id="targetType"
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
              >
                <option value="clock_in">出勤</option>
                <option value="break_begin">休憩開始</option>
                <option value="break_end">休憩終了</option>
                <option value="clock_out">退勤</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Field.Root>

          <Text>現在の状態：{employeeStatus}</Text>
        </CardBody>

        <CardFooter>
          <Button onClick={test2} colorScheme="teal">
            テスト用2
          </Button>
        </CardFooter>
      </Card.Root>
    </Flex>
  );
};

export default Stamping;

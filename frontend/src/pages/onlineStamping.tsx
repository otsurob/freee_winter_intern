import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEmployeeStatus, postStampingInfo } from "../api/freeeApi";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Input,
  Box,
  Field,
  NativeSelect,
  Flex,
} from "@chakra-ui/react";
import { onlineStamp } from "@/api/gasApi";

enum EmployeeStatus {
  working = "出勤中",
  breaking = "休憩中",
  leaving = "退勤中",
  None = "未打刻",
}

const OnlineStamping = () => {
  const [searchParams] = useSearchParams();
  const [available, setAvailable] = useState<string[]>([]);
  const employeeId = searchParams.get("employeeId");
  const [targetType, setTargetType] = useState<string>("clock_in");

  // 現在時刻を初期値に設定しておく
  const now = new Date();
  const initialDate = now.toISOString().split("T")[0]; // YYYY-MM-DD形式
  const initialTime = now.toTimeString().slice(0, 5); // HH:MM形式

  const [stampDate, setStampDate] = useState<string>(initialDate);
  const [stampTime, setStampTime] = useState<string>(initialTime);

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
      console.log("従業員IDがありません");
      return;
    }
    if (!available.includes(targetType)) {
      // 警告toastを表示
      console.log("打刻種別が不正です");
      return;
    }

    // ユーザーが入力した日時を使って打刻
    const datetimeString = stampDate + " " + stampTime;

    console.log("オンライン打刻開始！", datetimeString);
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
    // console.log("shift change");
    // const id = await putShift(employeeId, "2025-03-26", "09:00", "18:00");
    // console.log(id);
    console.log("counter");
    await onlineStamp(employeeId);
  };

  return (
    <Flex
      align="center"
      justify="center"
      h="100vh" /* 画面全体の高さを指定して中央寄せ */
    >
      <Card.Root maxW="lg" w="full">
        <CardHeader>
          <Heading size="md">打刻ページ</Heading>
        </CardHeader>
        <CardBody>
          {/* 日付の入力欄 */}
          <Field.Root mb={4}>
            <Field.Label htmlFor="stamp_date">日にち</Field.Label>
            <Input
              type="date"
              id="stamp_date"
              value={stampDate}
              onChange={(e) => setStampDate(e.target.value)}
            />
          </Field.Root>

          {/* 時刻の入力欄 */}
          <Field.Root mb={4}>
            <Field.Label htmlFor="stamp_time">時間</Field.Label>
            <Input
              type="time"
              id="stamp_time"
              value={stampTime}
              onChange={(e) => setStampTime(e.target.value)}
            />
          </Field.Root>

          {/* 打刻種別の選択欄 */}
          <Field.Root mb={4}>
            <Field.Label htmlFor="target_type">登録種別</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                id="target_type"
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

          <Button onClick={stamping} colorScheme="blue">
            オンラインで打刻する
          </Button>

          <Box mt={4}>現在の状態：{employeeStatus}</Box>

          {/* <Button mt={4} onClick={test2} colorScheme="green">
            テスト用2
          </Button> */}
        </CardBody>
      </Card.Root>
    </Flex>
  );
};

export default OnlineStamping;

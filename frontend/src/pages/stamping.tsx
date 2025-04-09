import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getEmployeeStatus, postStampingInfo } from "../api/freeeApi";
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
import { toaster } from "@/components/ui/toaster";
import Loading from "@/components/loading";

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
  const employeeName = searchParams.get("employeeName");
  const [targetType, setTargetType] = useState<string>("clock_in");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!employeeId) return;
      // 打刻可能種別の取得
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
      toaster.create({
        title: "打刻種別が不正です",
        type: "error",
      });
      return;
    }

    // 現在の日付を処理しやすい形に
    const datetime = new Date();
    const dateString = datetime
      .toLocaleString("en-CA")
      .split("T")[0]
      .split(", ")[0];
    const timeString = datetime.toTimeString().slice(0, 5);
    const datetimeString = dateString + " " + timeString;
    setIsUpdating(true);
    const stampingResponse = await postStampingInfo(
      employeeId,
      datetimeString,
      targetType
    );
    console.log(stampingResponse);
    toaster.create({
      title: "打刻しました",
      type: "success",
    });
    navigate("/owner/stampingHome");
  }

  let employeeStatus: string = "";
  if (available.length === 0) {
    return <Loading />;
  }
  // 従業員の状態を設定
  if (available[0] === "break_begin") {
    employeeStatus = EmployeeStatus.working;
  } else if (available[0] === "break_end") {
    employeeStatus = EmployeeStatus.breaking;
  } else if (available[0] === "clock_in" || available[0] === "clock_out") {
    employeeStatus = EmployeeStatus.leaving;
  } else {
    employeeStatus = EmployeeStatus.None;
  }

  return (
    <Flex align="center" justify="center" h="100vh">
      <Card.Root maxW="md" w="full">
        <CardHeader>
          <Heading size="md">{employeeName} さんの打刻ページ</Heading>
        </CardHeader>

        <CardBody>
          <Button onClick={stamping} colorScheme="blue" mb={4}>
            打刻する
          </Button>
          {isUpdating ? <Heading size="md">処理中...</Heading> : <></>}
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
          <Button onClick={() => navigate("/owner/stampingHome")}>
            打刻画面へ戻る
          </Button>
        </CardFooter>
      </Card.Root>
    </Flex>
  );
};

export default Stamping;

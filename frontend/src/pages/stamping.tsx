import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEmployeeStatus, postStampingInfo, putShift } from "../api/freeeApi";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Header from "@/components/header";

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
    <>
      <Header />
      <Card>
        <CardHeader>
          <CardTitle>打刻ページ</CardTitle>
        </CardHeader>

        <Button onClick={stamping}>打刻する</Button>

        <div className="my-4">
          <Label htmlFor="target_type" className="mb-2 block">
            登録種別
          </Label>
          <Select
            value={targetType}
            onValueChange={(val) => setTargetType(val)}
          >
            <SelectTrigger id="target_type">
              <SelectValue placeholder="打刻種別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clock_in">出勤</SelectItem>
              <SelectItem value="break_begin">休憩開始</SelectItem>
              <SelectItem value="break_end">休憩終了</SelectItem>
              <SelectItem value="clock_out">退勤</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>現在の状態：{employeeStatus}</div>

        <br />
        <Button onClick={test2}>テスト用2</Button>
      </Card>
    </>
  );
};

export default Stamping;

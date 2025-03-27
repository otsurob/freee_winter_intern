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
import { Input } from "@/components/ui/input"; // shadcn UIのInputコンポーネント
import Header from "@/components/header";

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

        {/* 日付の入力欄 */}
        <div className="mb-4">
          <Label htmlFor="stamp_date" className="mb-2 block">
            日にち
          </Label>
          <Input
            type="date"
            id="stamp_date"
            value={stampDate}
            onChange={(e) => setStampDate(e.target.value)}
          />
        </div>

        {/* 時刻の入力欄 */}
        <div className="mb-4">
          <Label htmlFor="stamp_time" className="mb-2 block">
            時間
          </Label>
          <Input
            type="time"
            id="stamp_time"
            value={stampTime}
            onChange={(e) => setStampTime(e.target.value)}
          />
        </div>

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

        <Button onClick={stamping}>オンラインで打刻する</Button>

        <div className="mt-4">現在の状態：{employeeStatus}</div>

        <br />
        <Button onClick={test2}>テスト用2</Button>
      </Card>
    </>
  );
};

export default OnlineStamping;

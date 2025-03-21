import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEmployeeStatus, postStampingInfo } from "../api/freeeApi";

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
  if (available.length == 0) {
    return <div>Loading...</div>;
  }
  if (available[0] == "break_begin") {
    employeeStatus = EmployeeStatus.working;
  } else if (available[0] == "break_end") {
    employeeStatus = EmployeeStatus.breaking;
  } else if (available[0] == "clock_in" || available[0] == "clock_out") {
    employeeStatus = EmployeeStatus.leaving;
  } else {
    employeeStatus = EmployeeStatus.None;
  }
  console.log(available);
  return (
    <div>
      <h1>打刻ページ</h1>
      <button onClick={stamping}>打刻する</button>
      <div>
        <label>登録種別</label>
        <select
          name="target_type"
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
        >
          <option value="clock_in">出勤</option>
          <option value="break_begin">休憩開始</option>
          <option value="break_end">休憩終了</option>
          <option value="clock_out">退勤</option>
        </select>
      </div>
      <div>現在の状態：{employeeStatus}</div>
      <br></br>
    </div>
  );
};

export default Stamping;

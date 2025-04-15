import { GAS_API_URL } from "@/constants/constants";
import { ShiftData, NewScheduleData  } from "@/types/types";


function getRequestOptions(method: "GET" | "POST"): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "text/plain",
    },
  };
}

// ----------------------------------------------------------------------
// 2. getShiftData: スプレッドシートからシフト情報を取得する (GET)
//    GAS 側 doGet(e) で action="getSchedules" を判定するように
// ----------------------------------------------------------------------
export async function getShiftData(): Promise<ShiftData[] | null> {
  try {
    // "?action=getSchedules" をクエリパラメータに付与してGETリクエスト
    const url = `${GAS_API_URL}?action=getSchedules`;
    const response = await fetch(url, getRequestOptions("GET"));

    if (!response.ok) {
      console.error("Failed to fetch shift data:", response.status);
      return null;
    }

    const data: ShiftData[] = await response.json();
    console.log(data[0]["date"]);
    return data;
  } catch (error) {
    console.error("Error fetching shift data:", error);
    return null;
  }
}

// ----------------------------------------------------------------------
// 3. registerShiftData: スプレッドシートに新しいシフト情報を登録 (POST)
//    GAS 側 doPost(e) で action="writeToSheet" を判定する想定
// ----------------------------------------------------------------------
export async function registerShiftData(newScheduleData: NewScheduleData): Promise<null> {
  try {
    // body に action と 実際に登録したいデータ(payload) を入れて送信
    const response = await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "writeToSheet",
        payload: newScheduleData,
      }),
    });

    if (!response.ok) {
      console.error("Failed to register shift data:", response.status);
      return null;
    }

    // GAS側からの結果メッセージなどを受け取る
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error registering shift data:", error);
    return null;
  }
}


export async function onlineStamp(employeeId:string): Promise<null> {
    try {
      // body に action と 実際に登録したいデータ(payload) を入れて送信
      const response = await fetch(GAS_API_URL + "?employeeId=" + employeeId, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
      });
  
  
      // GAS側からの結果メッセージなどを受け取る
      const result = await response;
      console.log(result);
      return null;
    } catch (error) {
      console.error("Error registering shift data:", error);
      return null;
    }
  }
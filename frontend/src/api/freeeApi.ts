// src/api/freeeApi.ts
import { COMPANY_ID, ACCESS_TOKEN, BASE_API_URL } from "../constants/constants";

// const API_BASE_URL = "https://api.freee.co.jp";

// **型定義**
export interface Employee {
  id: number;
  display_name: string;
}

export interface Company {
  company_id: number;
  display_name: string;
}

// APIリクエストオプションを生成する
function getRequestOptions<T extends object | undefined>(
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    payload?: T
  ): RequestInit {
    return {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: payload ? JSON.stringify(payload) : undefined,
    };
  }

// 会社名を取得
export async function getCompanyName(): Promise<string> {
    const requestUrl = `${BASE_API_URL}/api/1/companies/${COMPANY_ID}`;
    const response = await fetch(requestUrl, getRequestOptions("GET"));
    const responseJson: { company: Company } = await response.json();
    if (!response.ok) {
      console.error(responseJson);
      return "取得エラー";
    }
    return responseJson.company.display_name;

}

//従業員一覧を取得
export async function getEmployees(): Promise<Employee[]> {
    const requestUrl = `${BASE_API_URL}/hr/api/v1/companies/${COMPANY_ID}/employees?limit=50&with_no_payroll_calculation=true`;
    const response = await fetch(requestUrl, getRequestOptions("GET"));
    const responseJson: Employee[] = await response.json();
    return responseJson;
}

// 従業員の打刻可能種目を取得
export async function getEmployeeStatus(employeeId:string): Promise<string[]> {
    const requestUrl = `${BASE_API_URL}/hr/api/v1/employees/${employeeId}/time_clocks/available_types?company_id=${COMPANY_ID}`;
    const response = await fetch(requestUrl, getRequestOptions("GET"));
    const responseJson = await response.json();
    return responseJson["available_types"];
}

// 打刻API
export async function postStampingInfo(employeeId:string, datetime:string, type:string): Promise<string> {
    const requestUrl = `${BASE_API_URL}/hr/api/v1/employees/${employeeId}/time_clocks`;
    const response = await fetch(requestUrl, getRequestOptions("POST", {
        "company_id":COMPANY_ID,
        "type":type,
        "datetime":datetime,
    }));
    const responseJson = await response.json();
    return responseJson["employee_time_clock"]["type"];
}

// 従業員作成
      // 良い感じに入力から受け取ってくれ
      // フォームを使うのがよさそう
export async function createEmployee(): Promise<string> {
  const requestUrl = `${BASE_API_URL}/hr/api/v1/employees`;
  const response = await fetch(requestUrl, getRequestOptions("POST", {
    "company_id":COMPANY_ID,
    "employee":{
      "num":"A-123",
      "working_hours_system_name":"shift",
      "last_name":"苗字",
      "first_name":"名前",
      "last_name_kana":"ミョウジ",
      "first_name_kana":"ナマエ",
      "birth_date":"1990-01-01",
      "entry_date":"2000-01-01",
      "pay_calc_type":"monthly",
      "pay_amount":300000
    }
  }));
  console.log("success?");
  const responseJson = await response.json();
  return responseJson["employee"]["id"];
}

export async function putShift(employeeId:string, date:string, shift_in:string, shift_out:string): Promise<string> {
  // date : YYYY-MM-DD
  // shift_in : HH:MM
  // shift_out : HH:MM
  const requestUrl = `${BASE_API_URL}/hr/api/v1/employees/${employeeId}/work_records/${date}`;
  const workMin = Number(shift_out.slice(0,2))*60+Number(shift_out.slice(3,5)) - (Number(shift_in.slice(0,2))*60+Number(shift_in.slice(3,5)));
  console.log(workMin);
  console.log(date+" "+shift_in+":00");
  console.log(date+" "+shift_out+":00");
  const response = await fetch(requestUrl, getRequestOptions("PUT", {
    "company_id":COMPANY_ID,
    "break_records":[
      {
        "clock_in_at":date+" "+"12:00:00",
        "clock_out_at":date+" "+"13:00:00",
      }
    ],
    "work_record_segments":[
      {
        "clock_in_at":date+" "+shift_in+":00",
        "clock_out_at":date+" "+shift_out+":00",
      }
    ],
    "day_pattern":"normal_day",
    "normal_work_clock_in_at":date+" "+shift_in+":00",
    "normal_work_clock_out_at":date+" "+shift_out+":00",
    "normal_work_mins":workMin,
    "use_default_work_pattern":false
  }));
  const responseJson = await response.json();
  return responseJson["shift"]["id"];
}
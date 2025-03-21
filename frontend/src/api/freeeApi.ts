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

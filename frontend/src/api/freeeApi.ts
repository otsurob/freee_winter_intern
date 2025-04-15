// src/api/freeeApi.ts
import { ResisterInfo } from "@/types/types";
import { COMPANY_ID, ACCESS_TOKEN, BASE_API_URL } from "../constants/constants";
import { Employee } from "@/types/types";

// const API_BASE_URL = "https://api.freee.co.jp";

// **型定義**

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
export async function createEmployee(resisterEmp:ResisterInfo): Promise<string> {
  const requestUrl = `${BASE_API_URL}/hr/api/v1/employees`;
  const response = await fetch(requestUrl, getRequestOptions("POST", {
    "company_id":COMPANY_ID,
    "employee":{
      "num":resisterEmp.lineId,
      "working_hours_system_name":"first test",
      "last_name":resisterEmp.lastName,
      "first_name":resisterEmp.firstName,
      "last_name_kana":resisterEmp.lastNameLabel,
      "first_name_kana":resisterEmp.firstNameLabel,
      "birth_date":resisterEmp.birthDate,
      "entry_date":resisterEmp.entryDate,
      "pay_calc_type":"monthly",
      "pay_amount":300000
    }
  }));
  console.log("success?");
  const responseJson = await response.json();
  return responseJson["employee"]["id"];
}

// 月の勤怠情報サマリ
export async function getMonthSummary(employeeId:string, year:number, month:number): Promise<number> {
  const requestUrl = `${BASE_API_URL}/hr/api/v1/employees/${employeeId}/work_record_summaries/${year}/${month}?company_id=${COMPANY_ID}`;
  const response = await fetch(requestUrl, getRequestOptions("GET"));
  const responseJson = await response.json();
  return responseJson["total_normal_work_mins"];
}
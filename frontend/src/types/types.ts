export type Employee = {
  id: string;
  display_name: string;
};

export type MonthWorkTime = {
    name : string;
    workTime : number;
}

export type ResisterInfo = {
  lineId: string;
  lastName: string;
  firstName: string;
  lastNameLabel: string;
  firstNameLabel: string;
  birthDate: string;
  entryDate: string;
};

export enum EmployeeStatus {
  working = "出勤中",
  breaking = "休憩中",
  leaving = "退勤中",
  None = "未打刻",
}

/** 従業員ごとのシフト情報 */
export type EmployeeShift = {
  name: string;
  shift: string;
}

/** 日付ごとのシフト情報 */
export type ShiftData = {
  date: string;
  employees: EmployeeShift[];
}

/** シフト登録用のデータ(例) */
export type NewScheduleData = {
  empId: string;
  name: string;
  date: string;
  shift: string;
}
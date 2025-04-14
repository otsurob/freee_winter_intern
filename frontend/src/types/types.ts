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
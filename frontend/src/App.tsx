// src/App.tsx
import { useState, useEffect } from "react";
import { getCompanyName, getEmployees } from "./api/freeeApi";
import { useNavigate } from "react-router-dom";

interface Employee {
  id: number;
  display_name: string;
}

function App() {
  const [companyName, setCompanyName] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const name = await getCompanyName();
      const employeeData = await getEmployees();
      setCompanyName(name);
      setEmployees(employeeData);
    }
    fetchData();
  }, []);

  if (!companyName || !employees) return <div>Loading...</div>;

  return (
    <div>
      {/* 事業所情報 */}
      <div>
        <h2>事業所情報</h2>
        <span>事業所名称: </span>
        <span>{companyName}</span>
      </div>

      {/* 従業員一覧 */}
      <div>
        <h3>従業員一覧</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/stamping?employeeId=${employee.id}`)
                    }
                  >
                    {employee.id}
                  </button>
                </td>
                <td>{employee.display_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => navigate("/calender")}>カレンダー</button>
    </div>
  );
}

export default App;

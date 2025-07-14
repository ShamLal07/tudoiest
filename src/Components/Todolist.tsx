'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '../supabaseClient';
import DialogBox from './DialogBox'; // Assuming DialogBox is used for confirmation

// Define Employee interface for type safety
interface Employee {
  id: number;
  FirstName: string;
  LastName: string;
  job: string;
  age: number;
}

export default function TodoList() {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [isInput, setInput] = useState(false);
  const [job, setJob] = useState('');
  const [isCleartext, setCleartext] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const [data, setData] = useState<Employee[]>([]);
  const [filteredData, setFilteredData] = useState<Employee[]>([]);
  const [isConfirm, setConfirm] = useState(false);
  const [isAddUser, setAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number | undefined>();

  useEffect(() => {
    getData();
  }, []);

  const InsertRow = async (newObj: Employee) => {
    console.log(newObj);
    const { data: newData, error } = await supabase
      .from('empoly_list') // Kept as per original; confirm if it should be 'employee_list'
      .insert([{ FirstName: newObj.FirstName, LastName: newObj.LastName, job: newObj.job, age: newObj.age }])
      .select();
    console.log(newData, 'New_data');
    console.log(error, 'Error');
    if (error) console.error('Insert Error:', error);
    else setFilteredData((prev) => [...prev, ...(newData as Employee[])]);
  };

  const getData = async () => {
    const { data: empoly_list, error } = await supabase.from('empoly_list').select('*');
    console.log(error, 'dksmdksmdks');
    console.log(empoly_list, 'sdkdsmkdskdmskds');
    if (empoly_list) setFilteredData(empoly_list as Employee[]);
  };

  const handleSearch = () => {
    const filtered = data.filter(
      (item: Employee) =>
        item.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.job.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleEdit = (id: number) => {
    console.log(id);
    const dt = filteredData.find((item) => item.id === id);
    if (dt) {
      setUpdate(true);
      setInput(true);
      setFirstName(dt.FirstName);
      setLastName(dt.LastName);
      setAge(dt.age.toString());
      setJob(dt.job);
      setCurrentIndex(id);
      setCleartext(true);
    }
    console.log(dt);
  };

  const upDatedata = async (dt: Employee, id?: number) => {
    if (id !== undefined) {
      const { data, error } = await supabase
        .from('empoly_list')
        .update({ FirstName: dt.FirstName, LastName: dt.LastName, job: dt.job, age: dt.age })
        .eq('id', id)
        .select();
      console.log('error', error);
    }
  };

  const addUser = () => {
    setAddUser(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let error = '';
    if (FirstName.trim() === '') error += 'First name is required.\n';
    if (LastName.trim() === '') error += 'Last name is required.\n';
    if (job.trim() === '') error += 'Job is required.\n';
    if (Number(age) <= 0) error += 'Age must be greater than 0.\n';
    if (error) {
      alert(error);
      return;
    }
    const newObj: Employee = {
      id: data.length + 1,
      FirstName,
      LastName,
      job,
      age: Number(age),
    };
    const dt = [...filteredData];
    setData(dt);
    setFilteredData(dt);
    setConfirm(true);
    setAddUser(false);
    InsertRow(newObj);
  };

  const DataDelete = async (id: number) => {
    const { error } = await supabase.from('empoly_list').delete().eq('id', id);
    if (error) console.error('Delete Error:', error);
  };
  
  const handleDelete = (id: number) => {
    if (id > 0 && window.confirm('Are you sure delete?')) {
      const newData = filteredData.filter((item) => item.id !== id);
      setData(newData);
      setFilteredData(newData);
      DataDelete(id);
    }
  };

  const handleUpdate = (index: number, id?: number) => {
    console.log(currentIndex === id);
    console.log(currentIndex, id);
    if (currentIndex === id && id !== undefined) {
      const dt = [...filteredData];
      dt[index].FirstName = FirstName;
      dt[index].LastName = LastName;
      dt[index].age = Number(age);
      dt[index].job = job;
      setData(dt);
      setFilteredData(dt);
      setInput(false);
      setCleartext(false);
      upDatedata(dt[index], id);
    }
  };

  const ClearData = () => {
    setFirstName('');
    setLastName('');
    setAge('');
    setJob('');
    setAddUser(false);
    setInput(false);
    setCleartext(false);
  };

  const handleConfirmBox = () => {
    setConfirm(false);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 transition-all">
      {/* 🔍 Search */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <div className="flex w-full max-w-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="🔍 Search by First Name, Last Name, or Job"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-white dark:bg-gray-800 outline-none"
          />
          <button onClick={handleSearch} className="px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/search.svg" alt="Search" width={20} height={20} className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={addUser}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-lg shadow hover:from-purple-600 hover:to-blue-600"
        >
          + Add User
        </button>
      </div>

      {/* ➕ Add Form */}
      {isAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="grid grid-cols-1 gap-4 bg-blue-500 p-8 rounded-2xl max-w-md w-full">
            <div className="flex flex-col gap-2">
              <div>
                <label className="block text-sm font-medium text-white">First Name</label>
                <input
                  type="text"
                  value={FirstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Last Name</label>
                <input
                  type="text"
                  value={LastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Job</label>
                <input
                  type="text"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">Age</label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-center">
              <button onClick={ClearData} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Cancel
              </button>
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📋 Table */}
      <div className="table-container bg-white dark:bg-gray-900 rounded-xl shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-2 py-1 text-center text-xs sm:text-sm">Sr.No</th>
              <th className="px-2 py-1 text-center text-xs sm:text-sm">First Name</th>
              <th className="px-2 py-1 text-center text-xs sm:text-sm">Last Name</th>
              <th className="px-2 py-1 text-center text-xs sm:text-sm hidden sm:table-cell">Job</th>
              <th className="px-2 py-1 text-center text-xs sm:text-sm hidden md:table-cell">Age</th>
              <th className="px-2 py-1 text-center text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} className="border-t dark:border-gray-800">
                <td data-label="Sr.No" className="px-2 py-1 text-center text-xs sm:text-sm">
                  {index + 1}
                </td>
                <td data-label="First Name" className="px-2 py-1 text-center text-xs sm:text-sm">
                  {isInput && currentIndex === item.id ? (
                    <input
                      type="text"
                      value={FirstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border px-1 py-0.5 w-full rounded text-center dark:bg-gray-800 dark:text-white text-xs sm:text-sm"
                    />
                  ) : (
                    <span>{item.FirstName}</span>
                  )}
                </td>
                <td data-label="Last Name" className="px-2 py-1 text-center text-xs sm:text-sm">
                  {isInput && currentIndex === item.id ? (
                    <input
                      type="text"
                      value={LastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border px-1 py-0.5 w-full rounded text-center dark:bg-gray-800 dark:text-white text-xs sm:text-sm"
                    />
                  ) : (
                    <span>{item.LastName}</span>
                  )}
                </td>
                <td data-label="Job" className="px-2 py-1 text-center text-xs sm:text-sm hidden sm:table-cell">
                  {isInput && currentIndex === item.id ? (
                    <input
                      type="text"
                      value={job}
                      onChange={(e) => setJob(e.target.value)}
                      className="border px-1 py-0.5 w-full rounded text-center dark:bg-gray-800 dark:text-white text-xs sm:text-sm"
                    />
                  ) : (
                    <span>{item.job}</span>
                  )}
                </td>
                <td data-label="Age" className="px-2 py-1 text-center text-xs sm:text-sm hidden md:table-cell">
                  {isInput && currentIndex === item.id ? (
                    <input
                      type="text"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="border px-1 py-0.5 w-full rounded text-center dark:bg-gray-800 dark:text-white text-xs sm:text-sm"
                    />
                  ) : (
                    <span>{item.age}</span>
                  )}
                </td>
                <td data-label="Actions" className="px-2 py-1 text-center flex flex-col sm:flex-row justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-yellow-500 text-white px-2 py-0.5 rounded hover:bg-yellow-600 text-xs sm:text-sm"
                  >
                    {isCleartext && currentIndex === item.id ? 'Clear' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdate(index, item.id)}
                    className="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600 text-xs sm:text-sm"
                  >
                    {isUpdate ? 'Update' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {isConfirm && (
        <DialogBox
          isOpen={isConfirm}
          onClose={handleConfirmBox}
          onConfirm={() => {
            setFirstName('');
            setLastName('');
            setAge('');
            setJob('');
            setConfirm(false);
            setAddUser(true);
          }}
          message="You can now add another or close this window."
        />
      )}
    </div>
  );
}
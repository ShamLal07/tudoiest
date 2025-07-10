'use client'
import { useEffect, useState } from "react";
import Image from 'next/image'
import {supabase}  from "../supabaseClient"

export default function TodoList() {
  const [FirstName, setFirstname] = useState('');
  const [LastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [isInput, SetInput] = useState(false);
  const [id, setId] = useState('0');
  const [job, setJob] = useState('');
  const [isCleartext, setcleartext] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isconfirm, setconfirm] = useState(false);
  const [isaddUser, SetUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentindex, setcurrentindex] = useState<number>();
  const [Employedata,  setEmployedata] = useState<any[]>([]);
  const [selectedindex,setselectedindex] = useState<any>()
  useEffect(() => {
    setData(Employedata);
    // setFilteredData(setFilteredData);
    console.log(filteredData, "")
    getData();

  }, []);

    const InsertRow = async(newObj:any) => {
      console.log(newObj);
      const { data, error } = await supabase
        .from('empoly_list')
        .insert([
          { FirstName:newObj.FirstName, LastName: newObj.LastName, job:newObj.job , age:newObj.age },
        ])
        .select()
      console.log(data, "New_data")
      console.log(error, "Error")

  };
   const getData = async () =>{
  let { data: empoly_list, error } = await supabase
  .from('empoly_list')
  .select('*')
   console.log(error, "dksmdksmdks")
    console.log(empoly_list, "sdkdsmkdskdmskds")
    empoly_list && setFilteredData(empoly_list);
   }


  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item?.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.LastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.job?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleEdit = (id: any) => {
    console.log(id);
    
    const dt = filteredData.find(item => item.id === id);
    if (dt !== undefined) {
      setUpdate(true);
      SetInput(true);
      setFirstname(dt.FirstName);
      setLastName(dt.LastName);
      setAge(dt.age);
      setJob(dt.job);
      setcurrentindex(id);
      setcleartext(true);
      
    }
    console.log(dt);
    
    upDatedata(dt,id);
  };
const upDatedata = async(dt:any,id?:number) =>{
  console.log('id',id);
  console.log('DT',dt);
  
  const { data, error } = await supabase
    .from('empoly_list')
    .update({ FirstName:dt.FirstName, LastName: dt.LastName, job:dt.job , age:dt.age },)
    .eq('id', id)
    .select()
    console.log(data, "fdijjfidjixfjdifjidjfidkjfi");
    console.log('error',error);
    
          
   }
  const addUser = () => {
    SetUser(true);
  };

  const handleSave = (e: any) => {
    let error = '';
    if (FirstName.trim() === '') error += "First name is required.\n";
    if (LastName.trim() === '') error += "Last name is required.\n";
    if (job.trim() === '') error += "Job is required.\n";
    if (Number(age) <= 0) error += "Age must be greater than 0.\n";
    if (error !== '') {
      e.preventDefault();
      alert(error);
    } else {
      const dt = [...filteredData];
      const newObj = {
        id: data.length + 1,
        FirstName: FirstName,
        LastName: LastName,
        job: job,
        age: Number(age),
      };
      dt.push(newObj);
      setData(dt);
      setFilteredData(dt);
      setconfirm(true);
      SetUser(false);
      InsertRow(newObj);

    }
  };
const DataDelete = async (id: number) => {
  const { error } = await supabase
    .from('empoly_list')
    .delete()
    .eq('id', id);
  if (error) console.error("Delete Error:", error);
};

 const handleDelete = (id: number) => {
  if (id > 0 && window.confirm("Are you sure delete?")) {
    const newData = filteredData.filter(item => item.id !== id);
    setData(newData);
    setFilteredData(newData);
    DataDelete(id); 
  }
};




  const handleUpdate = (index: number, id?:number|undefined) => {
    console.log(currentindex == id);
    console.log(currentindex , id);
    
    
    if(currentindex == id){
    const dt = [...filteredData];
    console.log(dt)
    console.log('handleUpdate',id);
    dt[index].FirstName = FirstName;
    dt[index].LastName = LastName;
    dt[index].age = age;
    dt[index].job = job;
    setData(dt);
    setFilteredData(dt);
    SetInput(false);
    setcleartext(false);
    upDatedata(dt,id);
    }
  };

  const ClearData = () => {
    setId(id);
    setFirstname('');
    setLastName('');
    setAge('');
    setJob('');
    SetUser(false);
    SetInput(false);
    setcleartext(false);
  };

  const handleConfirmBox=()=>{
    setconfirm(false);
  }
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
        <img src="/search.svg" alt="search" className="w-5 h-5" />
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
  {isaddUser && (
    <div className=" p-6 rounded-xl shadow mb-6 fixed w-full h-full top-0 m-3 flex items-center justify-center flex-col ">
      <div className="grid grid-cols-1 gap-4 bg-blue-500 p-8 rounded-2xl max-[900px] mx-auto grid-col-1: justify-center z-10 relative">
            <div className="flex flex-col gap-2">
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <input type="text" value={FirstName} onChange={(e) => setFirstname(e.target.value)} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <input type="text" value={LastName} onChange={(e) => setLastName(e.target.value)} className="w-full border px-3 py-2 rounded" />
                </div>
            <div>
              <label className="block text-sm font-medium">Job</label>
              <input type="text" value={job} onChange={(e) => setJob(e.target.value)} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input type="text" value={age} onChange={(e) => setAge(e.target.value)} className="w-full border px-3 py-2 rounded" />
            </div>
            </div>
              <div className="mt-4 flex gap-2 justify-center">
                <button onClick={ClearData} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Cancel</button>
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            </div>
      </div>

    </div>
  )}

<div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
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
        <tr key={index} className="border-t dark:border-gray-800">
          <td className="px-2 py-1 text-center text-xs sm:text-sm">{index + 1}</td>
          <td className="px-2 py-1 text-center text-xs sm:text-sm">
            {isInput && currentindex === item.id ? (
              <input
                type="text"
                value={FirstName}
                onChange={(e) => setFirstname(e.target.value)}
                className="border px-1 py-0.5 w-full rounded text-center dark:bg-gray-800 dark:text-white text-xs sm:text-sm"
              />
            ) : (
              <span>{item.FirstName}</span>
            )}
          </td>
          <td className="px-2 py-1 text-center text-xs sm:text-sm">
            {isInput && currentindex === item.id ? (
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
          <td className="px-2 py-1 text-center text-xs sm:text-sm hidden sm:table-cell">
            {isInput && currentindex === item.id ? (
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
          <td className="px-2 py-1 text-center text-xs sm:text-sm hidden md:table-cell">
            {isInput && currentindex === item.id ? (
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
          <td className="px-2 py-1 text-center flex flex-col sm:flex-row justify-center gap-1 sm:gap-2">
            <button
              onClick={() => handleEdit(item.id)}
              className="bg-yellow-500 text-white px-2 py-0.5 rounded hover:bg-yellow-600 text-xs sm:text-sm"
            >
              {isCleartext && currentindex === item.id ? "Clear" : "Edit"}
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
              {isUpdate ? "Update" : "Save"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  {isconfirm && (
    <div className="fixed inset-0 flex items-center justify-center  bg-black ">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">User Added Successfully</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">You can now add another or close this window.</p>
        <div className="flex gap-2 items-center justify-center">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setFirstname('');
              setLastName('');
              setAge('');
              setJob('');
              setconfirm(false);
              SetUser(true);
              
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add More
          </button>
        </div>
        <div>
          <button onClick={handleConfirmBox} className="px-5 py-2 bg-red-500 border">Close</button>
        </div>
        </div>

      </div>
    </div>
  )}
</div>

  );
}

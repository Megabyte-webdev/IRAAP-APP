import React from "react";

export const AddStudentForm = ({ newStudent, setNewStudent, onAdd }: any) => (
  <div className="flex gap-2">
    <input
      type="text"
      placeholder="Lastname"
      value={newStudent.lastname}
      onChange={(e) =>
        setNewStudent({ ...newStudent, lastname: e.target.value })
      }
      className="border p-2 rounded flex-1"
    />
    <input
      type="text"
      placeholder="Firstname"
      value={newStudent.firstname}
      onChange={(e) =>
        setNewStudent({ ...newStudent, firstname: e.target.value })
      }
      className="border p-2 rounded flex-1"
    />
    <input
      type="email"
      placeholder="Email"
      value={newStudent.email}
      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
      className="border p-2 rounded flex-1"
    />
    <button
      onClick={() => onAdd(newStudent)}
      className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
    >
      Add
    </button>
  </div>
);

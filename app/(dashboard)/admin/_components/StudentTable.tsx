import { Trash2, Edit3, Save } from "lucide-react";

export const StudentTable = ({
  data,
  editingIndex,
  editingRow,
  setEditingRow,
  startEditing,
  saveEditing,
  deleteRow,
}: any) => (
  <div className="max-h-64 overflow-y-auto border border-slate-100 rounded-xl">
    <table className="w-full text-left text-sm">
      <thead className="sticky top-0 bg-slate-100 border-b border-slate-200">
        <tr>
          <th className="p-2">Lastname</th>
          <th className="p-2">Firstname</th>
          <th className="p-2">Email</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, i: number) => (
          <tr key={i} className="hover:bg-slate-50">
            <td className="p-2">
              {editingIndex === i ? (
                <input
                  value={editingRow.lastname}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, lastname: e.target.value })
                  }
                  className="border p-1 rounded w-full"
                />
              ) : (
                row.lastname
              )}
            </td>
            <td className="p-2">
              {editingIndex === i ? (
                <input
                  value={editingRow.firstname}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, firstname: e.target.value })
                  }
                  className="border p-1 rounded w-full"
                />
              ) : (
                row.firstname
              )}
            </td>
            <td className="p-2">
              {editingIndex === i ? (
                <input
                  value={editingRow.email}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, email: e.target.value })
                  }
                  className="border p-1 rounded w-full"
                />
              ) : (
                row.email
              )}
            </td>
            <td className="p-2 flex gap-2">
              {editingIndex === i ? (
                <button onClick={saveEditing} className="text-green-600">
                  <Save size={16} />
                </button>
              ) : (
                <button
                  onClick={() => startEditing(i)}
                  className="text-blue-600"
                >
                  <Edit3 size={16} />
                </button>
              )}
              <button onClick={() => deleteRow(i)} className="text-red-600">
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom"; // Import navigate hook

export default function QuizAttemptTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [questionsData, setQuestionsData] = useState({}); // Store fetched questions
  const navigate = useNavigate();

  // Fetch question details when modal opens
  useEffect(() => {
    if (selectedAttempt) {
      const fetchQuestions = async () => {
        const newQuestionsData = {};
        for (const response of selectedAttempt.responses) {
          if (!questionsData[response.questionId]) {
            const res = await fetch(
              `http://localhost:5000/api/questions/${response.questionId}`
            );
            const question = await res.json();
            newQuestionsData[response.questionId] = question;
          }
        }
        setQuestionsData((prev) => ({ ...prev, ...newQuestionsData }));
      };
      fetchQuestions();
    }
  }, [selectedAttempt]);

  // Define table columns
  const columns = [
    {
      header: "Roll No",
      accessorKey: "rollno",
      cell: ({ row }) => (
        <button
          className="text-blue-600 underline"
          onClick={() => navigate(`/analysis/student/${row.original.rollno}`)}
        >
          {row.original.rollno}
        </button>
      ),
    },
    { header: "Name", accessorKey: "name" },
    { header: "Quiz Title", accessorKey: "quizTitle" },
    { header: "Category", accessorKey: "category" },
    { header: "Subcategory", accessorKey: "subcategory" },
    { header: "Score", accessorKey: "score" },
    { header: "Time Taken (s)", accessorKey: "timeTaken" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => setSelectedAttempt(row.original)}
        >
          View Responses
        </button>
      ),
    },
  ];

  // Create Table Instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter, // Enable filtering
  });

  return (
    <div className="p-4 border rounded shadow">
      {/* Search Input */}
      <input
        type="text"
        className="w-full p-2 border rounded mb-3"
        placeholder="Search by Name"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      {/* Quiz Attempts Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Responses Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40rem]">
            <h2 className="text-2xl font-bold mb-4">Quiz Responses</h2>
            <p className="text-gray-600">Quiz: {selectedAttempt.quizTitle}</p>
            <p className="text-gray-600">
              Category: {selectedAttempt.category} -{" "}
              {selectedAttempt.subcategory}
            </p>
            <p className="text-gray-600">Score: {selectedAttempt.score}</p>

            <div className="mt-4 space-y-4">
              {selectedAttempt.responses.map((response, index) => {
                const question = questionsData[response.questionId];

                return (
                  <div key={index} className="p-4 border rounded shadow">
                    <p className="font-semibold">
                      {question?.questionText || "Loading..."}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {question?.options?.map((option, optIndex) => (
                        <li
                          key={optIndex}
                          className={`p-2 border rounded ${
                            optIndex === question.correctOption
                              ? "bg-green-200" // Correct answer
                              : optIndex === response.selectedOption
                              ? "bg-red-200" // Incorrect answer
                              : ""
                          }`}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                    {question?.explanation && (
                      <p className="text-gray-600 mt-2">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded"
                onClick={() => setSelectedAttempt(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

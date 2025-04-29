import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import Layout from "../../components/Layout";

export default function QuizAnalysis() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const fetchQuizAnalysis = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/analysis/admin/quiz/${quizId}`
        );
        const data = await res.json();
        setQuizData(data);
      } catch (err) {
        setError("Failed to load quiz analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAnalysis();
  }, [quizId]);

  // Define table columns
  const columns = [
    { header: "Roll No", accessorKey: "rollno" },
    { header: "Name", accessorKey: "name" },
    { header: "Score", accessorKey: "score" },
    {
      header: "Time Taken (s)",
      accessorKey: "timeTaken",
      cell: ({ row }) => row.original.timeTaken[0] || "N/A",
    },
    {
      header: "Performance (%)",
      accessorKey: "categoryPerformance",
      cell: ({ row }) => {
        const key = `${quizData?.category} - ${quizData?.subcategory}`;
        return row.original.categoryPerformance[key] || "N/A";
      },
    },
    {
      header: "Attempted At",
      accessorKey: "attemptedAt",
      sortingFn: "datetime",
      cell: ({ row }) =>
        new Date(row.original.attemptedAt).toLocaleString() || "N/A",
    },
  ];

  // Create Table Instance
  const table = useReactTable({
    data: quizData?.performanceData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    initialState: {
      sorting: [{ id: "attemptedAt", desc: true }],
    },
    onGlobalFilterChange: setGlobalFilter, // Apply global search filter
  });

  if (loading) return <p>Loading quiz analysis...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Quiz Analysis</h1>
        <p className="text-gray-600">
          {quizData.quizTitle} ({quizData.category} - {quizData.subcategory})
        </p>
        <p className="text-gray-500 mb-4">
          <strong>Total Attempts:</strong> {quizData.totalAttempts}
        </p>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Roll No or Name..."
          className="p-2 border rounded w-full mb-4"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-md shadow-md">
            <thead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border p-3 text-left cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && " 🔼"}
                      {header.column.getIsSorted() === "desc" && " 🔽"}
                      {!header.column.getIsSorted() && " ⬍"}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-100 odd:bg-white even:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

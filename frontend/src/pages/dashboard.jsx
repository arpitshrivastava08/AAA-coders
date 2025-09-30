import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Citizen Dashboard</h1>
        <p className="mt-2">Welcome! Here you can track your complaints and points.</p>
      </div>
    </div>
  );
}

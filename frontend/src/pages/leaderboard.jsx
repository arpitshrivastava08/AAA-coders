import Navbar from "../components/Navbar";

export default function Leaderboard() {
  const staff = [
    { id: 1, name: "Staff A", points: 200 },
    { id: 2, name: "Staff B", points: 150 },
    { id: 3, name: "Staff C", points: 100 }
  ];

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        <ul>
          {staff.map((s) => (
            <li key={s.id} className="border-b p-2">{s.name} - {s.points} pts</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

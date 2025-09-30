import Navbar from "../components/Navbar";

export default function Wallet() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Wallet</h1>
        <p>You have <span className="font-bold text-green-600">120 points</span></p>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Redeem Points</button>
      </div>
    </div>
  );
}

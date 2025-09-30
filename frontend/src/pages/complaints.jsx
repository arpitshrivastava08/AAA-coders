import Navbar from "../components/Navbar";

export default function Complaints() {
  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-xl font-bold mb-4">Submit Complaint</h1>
        <form className="space-y-4">
          <input className="w-full p-2 border rounded" type="text" placeholder="Title" />
          <textarea className="w-full p-2 border rounded" placeholder="Description" />
          <input className="w-full p-2 border rounded" type="file" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        </form>
      </div>
    </div>
  );
}

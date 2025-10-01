import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white flex space-x-4">
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboarhdsd</Link>
      <Link href="/complaints">Complaintsss</Link>
      <Link href="/wallet">Wallet</Link>
      <Link href="/leaderboard">Leaderboard</Link>
    </nav>
  );
}

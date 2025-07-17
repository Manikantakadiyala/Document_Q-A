import Chat from "./components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">📄 Document Q&A System</h1>
      <Chat />
    </main>
  );
}
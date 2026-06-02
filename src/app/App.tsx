import { auth, db } from "../config/firebase";

function App() {
  console.log("Firebase Auth:", auth);
  console.log("Firestore DB:", db);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          HomeDECOR App
        </h1>

        <p className="mt-3 text-slate-600">
          Firebase conectado correctamente.
        </p>
      </section>
    </main>
  );
}

export default App;
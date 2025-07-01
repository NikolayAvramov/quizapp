import Quiz from "../components/Quiz";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Подготовка за изпита по юридическа правоспособност
        </h1>
        <Quiz />
      </div>
    </div>
  );
}

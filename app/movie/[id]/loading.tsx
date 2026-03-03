export default function Loading() {
  return (
    <main className="min-h-screen p-6 md:p-10 space-y-8 max-w-5xl mx-auto animate-pulse">
      <div className="rounded-3xl bg-white/10 p-6 md:flex gap-8">
        <div className="w-64 h-96 bg-gray-700 rounded-xl shrink-0" />
        <div className="flex-1 mt-6 md:mt-0 space-y-4">
          <div className="h-10 bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-700 rounded w-1/3" />
          <div className="h-24 bg-gray-700 rounded w-full mt-4" />
        </div>
      </div>
      <div className="h-48 bg-gray-700/50 rounded-3xl" />
    </main>
  );
}

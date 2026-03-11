export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
      <main className="flex flex-col items-center gap-6 text-center">
        <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-3xl mb-2">
          ⚽
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          진창호
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>
        <div className="flex gap-4 mt-4">
          <button className="px-6 py-2 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 font-medium transition-opacity hover:opacity-90">
            연락하기
          </button>
          <button className="px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            포트폴리오
          </button>
        </div>
      </main>
    </div>
  );
}

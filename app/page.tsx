export default function Home() {
  return (
    /* Background container with a subtle grid or solid color to make the card pop */
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#f1f1f1] dark:bg-zinc-950 font-sans">
      <main className="
        /* Responsive Width Constraints based on your guide */
        w-full 
        min-[350px]:max-w-[350px] 
        md:max-w-[700px] 
        lg:max-w-[1024px]
        
        /* Neobrutalism Style Guide */
        p-8 md:p-16
        bg-[#FEF08A] 
        border-[3px] border-black 
        shadow-[6px_6px_0px_0px_#000000] 
        rounded-[12px] 
        
        flex flex-col items-center text-center
      ">
        {/* Profile Image: 120px, Circular, 3px Border */}
        <div className="
          w-[120px] h-[120px] 
          rounded-full 
          bg-white 
          border-[3px] border-black 
          flex items-center justify-center 
          text-6xl mb-8 
          overflow-hidden
          shadow-[4px_4px_0px_0px_#000000]
        ">
          ⚽
        </div>
        
        {/* Name: Bold, High Contrast */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-6 uppercase italic">
          진창호
        </h1>
        
        {/* Bio: Bold Typography */}
        <p className="text-xl md:text-2xl font-bold text-black mb-12 leading-tight max-w-2xl">
          안녕하세요!<br />
          <span className="underline decoration-black decoration-4 underline-offset-4">바이브 코딩</span>을 배우고 있는 대학생입니다.
        </p>
        
        {/* Neobrutalist Buttons with Hard Shadows */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <button className="
            px-10 py-4 
            text-xl font-black 
            bg-black text-white 
            border-[3px] border-black 
            rounded-[12px]
            shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]
            active:translate-x-[4px] active:translate-y-[4px] 
            active:shadow-none 
            transition-all cursor-pointer
          ">
            연락하기
          </button>
          <button className="
            px-10 py-4 
            text-xl font-black 
            bg-white text-black 
            border-[3px] border-black 
            rounded-[12px]
            shadow-[6px_6px_0px_0px_#000000]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            hover:shadow-[8px_8px_0px_0px_#000000]
            active:translate-x-[4px] active:translate-y-[4px] 
            active:shadow-none 
            transition-all cursor-pointer
          ">
            포트폴리오
          </button>
        </div>
      </main>
    </div>
  );
}

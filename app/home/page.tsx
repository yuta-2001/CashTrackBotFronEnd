'use client';

export default function IndexPage() {
  return (
    <div className="flex justify-center" aria-label="読み込み中">
      <div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent mt-10"></div>
    </div>
  );
}

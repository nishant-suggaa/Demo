// index.tsx
import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex h-20 flex-row bg-red-500 justify-center item-center">
      <div className="flex flex-row justify-end items-center">
        <div className="text-xl m-2 p-1 text-red-900 rounded-lg hover:bg-red-300">
          <Link href="/items-list">
            Items List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

// src/pages/404.tsx
import { NextPage } from 'next';
import Link from 'next/link';

const Custom404: NextPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg mb-4">Page not foundssssss</p>
        <Link href="/">
          <a className="text-blue-500">Go back to Home</a>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;

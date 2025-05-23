import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-5">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <h2 className="text-3xl font-medium text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-5">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

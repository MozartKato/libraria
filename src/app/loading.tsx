export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
        <p className="mt-4 text-secondary-600">Memuat...</p>
      </div>
    </div>
  );
} 
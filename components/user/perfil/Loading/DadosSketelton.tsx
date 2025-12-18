// components/DadosSkeleton.tsx
export default function DadosSkeleton() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 dark:bg-gray-900 dark:border-gray-800 animate-pulse">
      {/* Cabeçalho Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-300 dark:bg-gray-700 rounded-xl w-10 h-10"></div>
          <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-xl w-24"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-xl w-32"></div>
        </div>
      </div>

      {/* Formulário Skeleton */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Campos skeleton */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl mt-1"></div>
            </div>
          ))}
        </div>

        {/* Botão Skeleton */}
        <div className="pt-4 flex justify-end">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl w-48"></div>
        </div>
      </div>
    </div>
  );
}
// components/HeaderSkeleton.tsx
export default function HeaderSkeleton() {
  return (
    <header className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 animate-pulse">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Informações principais - Skeleton */}
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-gray-300 dark:bg-gray-700 p-3 rounded-full">
            <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded mr-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-28"></div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded mr-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas - Skeleton */}
        {/* <div className="flex gap-4">
          <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-4"></div>
            </div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mx-auto"></div>
          </div>
          
          <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-4"></div>
            </div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-14 mx-auto"></div>
          </div>
        </div> */}

        {/* Botão de ação - Skeleton */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg text-sm font-medium w-24 h-10"></div>
      </div>
    </header>
  );
}
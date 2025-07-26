export default function SettingsLoading() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-primary to-red-600 text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-white/20 rounded-lg w-48 mb-2"></div>
                        <div className="h-4 bg-white/20 rounded-lg w-64"></div>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Content Skeleton */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="animate-pulse">
                                            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-64"></div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="animate-pulse space-y-4">
                                            {[...Array(3)].map((_, j) => (
                                                <div key={j} className="flex items-center justify-between">
                                                    <div className="space-y-2">
                                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                                                    </div>
                                                    <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

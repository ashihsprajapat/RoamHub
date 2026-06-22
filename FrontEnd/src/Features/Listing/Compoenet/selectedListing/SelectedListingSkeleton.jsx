

function SelectedListingSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                    <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="h-80 bg-gray-200 rounded-3xl"></div>
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="h-24 bg-gray-200 rounded-xl"></div>
                                <div className="h-24 bg-gray-200 rounded-xl"></div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                        <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                                <div className="h-20 bg-gray-200 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-12 bg-gray-200 rounded-xl"></div>
                                <div className="h-12 bg-gray-200 rounded-xl"></div>
                                <div className="h-12 bg-gray-200 rounded-xl"></div>
                            </div>
                        </div>
                        <div className="rounded-3xl bg-white shadow-lg p-6 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectedListingSkeleton

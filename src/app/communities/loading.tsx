import Loader from "@/components/ui/loader";

export default function CommunitiesLoading() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <Loader
                title="Loading Communities..."
                subtitle="Finding the best campus spaces for you"
                size="lg"
            />
        </div>
    );
}

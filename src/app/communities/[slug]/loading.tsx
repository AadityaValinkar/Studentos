import Loader from "@/components/ui/loader";

export default function CommunitySlugLoading() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <Loader
                title="Entering Community..."
                subtitle="Preparing your anonymous space"
                size="lg"
            />
        </div>
    );
}

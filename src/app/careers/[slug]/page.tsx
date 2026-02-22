import { RoadmapTimeline } from "@/components/careers/RoadmapTimeline";

export const revalidate = 3600; // Cache for 1 hour

async function fetchRoadmapData(slug: string) {
    try {
        const res = await fetch(`https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps/${slug}/${slug}.json`);

        if (!res.ok) {
            return null;
        }

        const data = await res.json();

        // Filter out empty structure nodes and sort purely by Y coordinate
        // This physically straightens the 2D web into a 1D timeline!
        const validNodes = data.nodes
            .filter((n: { data?: { label?: string } }) => n.data && n.data.label && n.data.label.trim() !== "")
            .map((n: { id: string; data: { label: string }; type?: string; position: { y: number } }) => ({
                id: n.id,
                label: n.data.label,
                type: n.type || 'subtopic',
                y: n.position.y
            }))
            .sort((a: { y: number }, b: { y: number }) => a.y - b.y);

        // Deduplicate labels (sometimes nodes overlap conceptually)
        const seen = new Set();
        const uniqueNodes = validNodes.filter((n: { label: string }) => {
            if (seen.has(n.label)) return false;
            seen.add(n.label);
            return true;
        });

        return uniqueNodes;

    } catch (e) {
        console.error("Failed to fetch roadmap", e);
        return null;
    }
}

export default async function RoadmapPage({ params }: { params: { slug: string } }) {
    const nodes = await fetchRoadmapData(params.slug);

    if (!nodes || nodes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl text-slate-300 font-light mb-4">Roadmap Not Found</h2>
                <p className="text-slate-500 font-light max-w-md">
                    We could not fetch the roadmap datastructure for &quot;{params.slug}&quot;. It may have been relocated in the open-source repository.
                </p>
            </div>
        );
    }

    return <RoadmapTimeline title={params.slug} nodes={nodes} />;
}

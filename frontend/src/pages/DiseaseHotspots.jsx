import DiseaseMap from "../components/DiseaseMap";

const DiseaseHotspots = () => {
    return (
        <div className="min-h-screen bg-green-50">
            <h1 className="text-3xl font-bold text-center py-6">
                Disease Hotspots Map
            </h1>
            <DiseaseMap />
        </div>
    );
};

export default DiseaseHotspots;
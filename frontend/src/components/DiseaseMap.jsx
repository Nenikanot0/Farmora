import { useEffect,useState } from "react";
import API from "../services/api.js";

import { MapContainer,TileLayer,CircleMarker,Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const DiseaseMap =() => {
    const [hotspots,setHotspots] = useState([]);

    useEffect(() => {
        const fetchHotspots = async()=> {
            try{
                const response = await API.get("/admin/disease-hotspots");
                
                setHotspots(response.data);
            }catch(error){
                console.log(error);
            }
        };
        fetchHotspots();
    },[]);

return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg">
            <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hotspots
                    .filter(spot => spot?.coordinates?.lat && spot?.coordinates?.lng)
                    .map((spot, index) => (
                        <CircleMarker
                            key={index}
                            center={[
                                spot.coordinates.lat,
                                spot.coordinates.lng
                            ]}
                            radius={Math.min(spot.cases / 2, 25)}
                        >
                            <Popup>
                                <div>
                                    <h2 className="font-bold">
                                        {
                                            spot._id.location
                                        }
                                    </h2>

                                    <p>
                                        Disease:
                                        {
                                            spot._id.disease
                                        }
                                    </p>

                                    <p>
                                        Cases:
                                        {
                                            spot.cases
                                        }
                                    </p>

                                    <p>
                                        Avg Risk:
                                        {
                                            spot.averageRisk
                                        }%
                                    </p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    )
                )}
            </MapContainer>
        </div>
    );
};

export default DiseaseMap;

export interface StationData {
    name: string;
    globalId: string;
    transportTypes: string[];
    distanceInMeters: number;
    services: StationServiceInfo[];
}

export enum TransportType {
    BUS = "BUS",
    TRAM = "TRAM",
    UBAHN = "UBAHN",
    SBAHN = "SBAHN",
    BAHN = "BAHN",
    SCHIFF = "SCHIFF",
    REGIONAL_BUS = "REGIONAL_BUS",
    RUFTAXI = "RUFTAXI",
}

export interface DepartureData {
    transportType: string;
    label: string;
    destination: string;
    departureInMinutes: number;
}

export interface StationServiceInfo {
    label: string;
    transportType: TransportType,
    trainType: string;
    network: string;
    divaId: string;
    sev: boolean;
}


export const fetchNearestStations = async (lat: number, lon: number, limit: number = 3) => {
    const fetchStations = async (latitude: number, longitude: number) => {
        const response = await fetch(
            `https://www.mvg.de/api/bgw-pt/v3/stations/nearby?latitude=${latitude}&longitude=${longitude}`
        );
        if (!response.ok) throw new Error("Failed to fetch data from MVG API");
        const data = await response.json();
        return data.slice(0, limit);
    };

    try {
        const stations = await fetchStations(lat, lon);
        if (stations.length > 0) {
            return stations;
        } else {
            // If no stations found, use fixed location (Munich Central Station)
            const fixedLat = 48.1407;
            const fixedLon = 11.5583;
            return await fetchStations(fixedLat, fixedLon);
        }
    } catch (error) {
        console.error("Error fetching stations:", error);
        // If API call fails, use fixed location (Munich Central Station)
        const fixedLat = 48.1407;
        const fixedLon = 11.5583;
        return await fetchStations(fixedLat, fixedLon);
    }
};

export const searchStations = async (query: string): Promise<StationData[]> => {
    try {
        const response = await fetch(`https://www.mvg.de/api/bgw-pt/v3/stations?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error("Failed to fetch stations");
        }
        const data = await response.json();
        return data.map((station: any) => ({
            name: station.name,
            globalId: station.globalId,
            transportTypes: station.transportTypes,
            distanceInMeters: station.distanceInMeters || 0,
            services: undefined
        }));
    } catch (error) {
        console.error("Error searching stations:", error);
        return [];
    }
}

export const fetchServices = async (station: StationData): Promise<StationServiceInfo[]> => {
    try {
        const response = await fetch(`https://www.mvg.de/api/bgw-pt/v3/lines/${station.globalId}`);
        if (!response.ok)
            return [];

        const data: StationServiceInfo[] = await response.json();

        // Filter out BAHN services and organize by transport type
        const filteredData = Array.from(data.filter(service => service.transportType !== TransportType.BAHN));

        // Separate night services (starting with N)
        const regularServices = filteredData.filter(service => !service.label.startsWith('N'));
        const nightServices = filteredData.filter(service => service.label.startsWith('N'));

        // sort regular services by type
        regularServices.sort((a, b) => Object.keys(TransportType).indexOf(a.transportType) - Object.keys(TransportType).indexOf(b.transportType))

        // Combine all services in the desired order
        return [
            ...regularServices,
            ...nightServices
        ]
    } catch {
        return [];
    }
}
export const fetchDepartures = async (
    stationId: string,
    transportTypes: { [key: string]: boolean },
    limit: number = 6
) => {
    try {
        const enabledTypes = Object.entries(transportTypes)
            .filter(([_, enabled]) => enabled)
            .map(([type]) => type)
            .join(',');

        const response = await fetch(
            `https://www.mvg.de/api/bgw-pt/v3/departures?globalId=${stationId}&limit=${limit}&transportTypes=${enabledTypes}`
        );

        if (!response.ok)
            throw new Error("Failed to fetch departure data from MVG API");

        const data = await response.json();
        const now = new Date();
        const departuresWithMinutes = data
            .map((dep: any) => ({
                ...dep,
                departureInMinutes: Math.round(
                    (new Date(dep.realtimeDepartureTime).getTime() - now.getTime()) /
                    60000
                ),
            }))
            .slice(0, 6); // Limit to 6 results at API level
        return departuresWithMinutes;
    } catch (error) {
        console.error("Error fetching departures:", error);
        return [];
    }
};

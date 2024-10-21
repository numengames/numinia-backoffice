/* eslint-disable @typescript-eslint/no-explicit-any */
export const spaceNameMap: Record<string, string> = {
    'Numinian tools - Age of AI': 'age_of_ai',
    'Numen Games - La Edad de la IA': 'la_edad_de_la_ia',
};

export async function fetchMetrics(endpoint: string, setState: React.Dispatch<React.SetStateAction<any>>, params: Record<string, string> = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `/api/metrics/${endpoint}${queryString ? `?${queryString}` : ''}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo acceder al endpoint ${endpoint}`);
        }
        const data = await response.json();
        setState(data[endpoint === 'count-sessions' ? 'sessionCount' : endpoint === 'active-sessions' ? 'activeSessions' : 'averageTime']);
    } catch (error) {
        console.error(`Error al obtener datos de ${endpoint}:`, error);
    }
}

export const getSpaceNameLink = (spaceName: string) => {
    const mappedSpaceName = spaceNameMap[spaceName] || spaceName;
    return `https://v2.oncyber.io/${encodeURIComponent(mappedSpaceName)}`;
};

export const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
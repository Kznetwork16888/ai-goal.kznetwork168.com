export async function submitToBackend(data) {
    const BACKEND_URL = ''; // Placeholder URL
    if (!BACKEND_URL) {
        console.warn('BACKEND_URL is not set. Simulating API submission...', data);
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
    }
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error submitting to backend:', error);
        throw error;
    }
}

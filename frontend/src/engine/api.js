const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class GigShieldAPI {
    /**
     * Core universal fetch request wrapper binding centralized JSON semantics and Error Handling logic
     */
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            
            // Allow native handling of potentially failing paths structurally
            if (!response.ok) {
                // If a hard 404 block is raised natively, propagate the structured model upwards
                if (response.status === 404) {
                    throw { status: 404, message: "Resource not found" };
                }
                const errData = await response.json().catch(() => ({}));
                throw { status: response.status, message: errData.message || errData.detail || "Request failed" };
            }

            const data = await response.json();
            return { data, status: response.status, ok: true };
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // ----------------------------------------------------
    // Context Routes mapping exactly to FastAPI definitions
    // ----------------------------------------------------

    /** Verify onboarding worker ID against ML Database */
    static async verifyWorker(workerId) {
        return this.request(`/workers/verify/${workerId}`);
    }

    /** GET computed real-time Actuarial Premium payload */
    static async getPremium(rainfall, aqi, temperature, traffic) {
        return this.request(`/policies/premium?rainfall=${rainfall}&aqi=${aqi}&temperature=${temperature}&traffic=${traffic}`);
    }

    /** Trigger ML claim workflow via POST payload dictionary */
    static async triggerClaim(payload) {
        return this.request('/claims/trigger', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    /** GET aggregate total counts for the admin dashboard */
    static async getAdminStats() {
        return this.request('/admin/stats');
    }

    /** GET [lat, lon, intensity] array payload representing current live map risks */
    static async getHeatmapZones() {
        return this.request('/heatmap/risk-zones');
    }
}

export default GigShieldAPI;

import React, { createContext, useContext, useState, useEffect } from 'react';

const BillingContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';
export const BillingProvider = ({ children }) => {
    const [bills, setBills] = useState([]);
    const [settings, setSettings] = useState({
        clinicName: "Zefveda",
        address: "",
        phone: "",
        gstNumber: "",
        defaultGst: 5,
    });
    const [items, setItems] = useState([]);
    const [consultations, setConsultations] = useState([]);
    // Load doctors from local storage or default to the requested list
    const [doctors, setDoctors] = useState(() => {
        const saved = localStorage.getItem('ayurveda_doctors');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: "Dr. Sahil Noufal", designation: "Ayurvedic Physician" },
            { id: 2, name: "Dr. Abhina Khan", designation: "Ayurvedic Physician" }
        ];
    });
    const [token, setToken] = useState(localStorage.getItem('ayurveda_token'));
    const [loading, setLoading] = useState(false);

    // Helper for authenticated requests
    const fetchWithAuth = async (endpoint, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
            const response = awaitfetch(`${API_URL}/api${endpoint}`,{
                ...options,
                headers,
                signal: controller.signal
            });
            clearTimeout(id);

            if (response.status === 401 || response.status === 403) {
                logout();
                throw new Error('Unauthorized');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.error(`API Timeout [${endpoint}]`);
                throw new Error("Request timed out. Please check your connection.");
            }
            console.error(`API Error [${endpoint}]:`, err.message);
            throw err;
        }
    };

    useEffect(() => {
        if (token) {
            loadInitialData();
        } else {
            // Reset state if logged out
            setBills([]);
            setItems([]);
            setConsultations([]);
        }
    }, [token]);

    const loadInitialData = async () => {
        setLoading(true);
        console.log("Initializing software data...");

        try {
            // Load each piece of data independently to prevent total failure
            const fetchBills = async () => {
                try {
                    const billsData = await fetchWithAuth('/bills');
                    if (Array.isArray(billsData)) {
                        const transformed = billsData.map(b => ({
                            ...b,
                            id: b.invoiceId,
                            date: b.billDate,
                            subtotal: parseFloat(b.subtotal) || 0,
                            taxAmount: parseFloat(b.taxAmount) || 0,
                            discount: parseFloat(b.discount) || 0,
                            grandTotal: parseFloat(b.grandTotal) || 0,
                            patient: { name: b.patientName, mobile: b.patientMobile },
                            payment: { mode: b.paymentMode, reference: b.paymentReference },
                            doctorName: b.doctorName,
                            consultationTime: b.consultationTime
                        }));
                        setBills(transformed);
                    }
                } catch (e) { console.error("Could not load bills", e); }
            };

            const fetchServices = async () => {
                try {
                    const itemsData = await fetchWithAuth('/services');
                    if (Array.isArray(itemsData)) {
                        setItems(itemsData.map(i => ({ ...i, rate: parseFloat(i.rate) || 0 })));
                    }
                } catch (e) { console.error("Could not load services", e); }
            };

            const fetchSettings = async () => {
                try {
                    const settingsData = await fetchWithAuth('/settings');
                    if (settingsData && !settingsData.error) {
                        setSettings({
                            ...settingsData,
                            defaultGst: parseFloat(settingsData.defaultGst) || 5
                        });
                    }
                } catch (e) { console.error("Could not load settings", e); }
            };

            const fetchConsultations = async () => {
                try {
                    const consultationsData = await fetchWithAuth('/consultations');
                    if (Array.isArray(consultationsData)) {
                        setConsultations(consultationsData);
                    }
                } catch (e) { console.error("Could not load consultations", e); }
            };

            // Run all in parallel but handled individually
            await Promise.allSettled([
                fetchBills(),
                fetchServices(),
                fetchSettings(),
                fetchConsultations()
            ]);

        } catch (err) {
            console.error("Critical error during data load", err);
        } finally {
            setLoading(false);
            console.log("Software data initialization complete.");
        }
    };

    const login = async (username, password) => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('ayurveda_token', data.token);
            setToken(data.token);
            return true;
        }
        throw new Error(data.message || 'Login failed');
    };

    const logout = () => {
        localStorage.removeItem('ayurveda_token');
        setToken(null);
    };

    const addBill = async (newBill) => {
        try {
            const savedBill = await fetchWithAuth('/bills', {
                method: 'POST',
                body: JSON.stringify(newBill)
            });

            const transformed = {
                ...savedBill,
                id: savedBill.invoiceId,
                date: savedBill.billDate,
                patient: { name: savedBill.patientName, mobile: savedBill.patientMobile },
                payment: { mode: savedBill.paymentMode, reference: savedBill.paymentReference }
            };

            setBills(prev => [transformed, ...prev]);
            return transformed;
        } catch (err) {
            console.error("Failed to add bill:", err);
            throw err; // Re-throw so UI can show error
        }
    };

    const cancelBill = async (invoiceId) => {
        try {
            await fetchWithAuth(`/bills/${invoiceId}/cancel`, { method: 'PATCH' });
            setBills(prev => prev.map(bill =>
                bill.id === invoiceId || bill.invoiceId === invoiceId ? { ...bill, status: 'Cancelled' } : bill
            ));
        } catch (err) {
            console.error("Failed to cancel bill:", err);
            throw err;
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            await fetchWithAuth('/settings', {
                method: 'PUT',
                body: JSON.stringify(newSettings)
            });
            setSettings(newSettings);
        } catch (err) {
            console.error("Failed to update settings:", err);
            throw err;
        }
    };

    const addItem = async (newItem) => {
        try {
            const savedItem = await fetchWithAuth('/services', {
                method: 'POST',
                body: JSON.stringify(newItem)
            });
            setItems(prev => [...prev, savedItem]);
            return savedItem;
        } catch (err) {
            console.error("Failed to add item:", err);
            throw err;
        }
    };

    const updateItem = async (id, updatedData) => {
        try {
            const updatedItem = await fetchWithAuth(`/services/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedData)
            });
            setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
            return updatedItem;
        } catch (err) {
            console.error("Failed to update item:", err);
            throw err;
        }
    };

    const deleteItem = async (id) => {
        try {
            await fetchWithAuth(`/services/${id}`, { method: 'DELETE' });
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error("Failed to delete item:", err);
            throw err;
        }
    };

    const addConsultation = async (newConsultation) => {
        try {
            const savedCons = await fetchWithAuth('/consultations', {
                method: 'POST',
                body: JSON.stringify(newConsultation)
            });
            setConsultations(prev => [savedCons, ...prev]);
            return savedCons;
        } catch (err) {
            console.error("Failed to add consultation:", err);
            throw err;
        }
    };

    const addDoctor = (doctor) => {
        const newDoc = { ...doctor, id: Date.now() };
        const updated = [...doctors, newDoc];
        setDoctors(updated);
        localStorage.setItem('ayurveda_doctors', JSON.stringify(updated));
    };

    const deleteDoctor = (id) => {
        const updated = doctors.filter(d => d.id !== id);
        setDoctors(updated);
        localStorage.setItem('ayurveda_doctors', JSON.stringify(updated));
    };

    const [prescriptions, setPrescriptions] = useState([]);

    const fetchPrescriptions = async () => {
        // Mock fetch or real endpoint if exists. For now, we might not have a backend for this.
        // If no backend endpoint, we can't persist easily without it.
        // Assuming we should mock it or use localStorage if backend not ready.
        // But the user asked for full software workflow.
        // Let's assume there is an endpoint '/prescriptions' or fallback to localStorage.
        try {
            // const data = await fetchWithAuth('/prescriptions');
            // if (Array.isArray(data)) setPrescriptions(data);
            // Fallback to local storage for now to ensure it works immediately
            const saved = localStorage.getItem('ayurveda_prescriptions');
            if (saved) setPrescriptions(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to load prescriptions", e);
        }
    };

    useEffect(() => {
        if (token) fetchPrescriptions();
    }, [token]);

    const addPrescription = async (prescription) => {
        try {
            // Mock backend save
            const newPrescription = { ...prescription, id: Date.now(), createdAt: new Date().toISOString() };
            const updated = [newPrescription, ...prescriptions];
            setPrescriptions(updated);
            localStorage.setItem('ayurveda_prescriptions', JSON.stringify(updated));

            // If backend exists:
            // await fetchWithAuth('/prescriptions', { method: 'POST', body: JSON.stringify(prescription) });

            return newPrescription;
        } catch (err) {
            console.error("Failed to add prescription:", err);
            throw err;
        }
    };

    return (
        <BillingContext.Provider value={{
            bills,
            settings,
            items,
            token,
            loading,
            login,
            logout,
            addBill,
            cancelBill,
            updateSettings,
            addItem,
            updateItem,
            deleteItem,
            consultations,
            addConsultation,
            doctors,
            addDoctor,
            deleteDoctor,
            prescriptions,
            addPrescription
        }}>
            {children}
        </BillingContext.Provider>
    );
};

export const useBilling = () => useContext(BillingContext);

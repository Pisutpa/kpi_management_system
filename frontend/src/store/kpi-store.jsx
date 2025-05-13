import axios from "axios"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware";
import { listUserApi } from "../api/manageUserApi";
import { listKpiApi } from "../api/KpiApi";
const kpiStore = (set) => ({
    user: null,
    token: null,
    listuser: [],
    listkpi: [],
    logout: () => {
        set({
            user: null,
            token: null,
            categories: [],
            products: [],
            carts: [],
        });
    },
    actionLogin: async (form) => {
        try {
            const res = await axios.post('http://localhost:5000/api/login', form);

            set({
                user: res.data.payload,
                token: res.data.token,
            });

            return res
        } catch (error) {
            console.error(error);

        }
    },
    getUser: async (token) => {
        try {
            const res = await listUserApi(token)
            console.log(res)
            set({ listuser: res.data })

        } catch (error) {
            console.log(error)

        }
    },
    getKpi: async (token) => {
        try {
            const res = await listKpiApi(token)
            set({ listkpi: res.data })
        } catch (error) {
            console.log(error);
        }
    }
});
const usePersist = {
    name: 'kpi-store',
    storage: createJSONStorage(() => localStorage)
}
const useKpiStore = create(persist(kpiStore, usePersist));

export default useKpiStore;

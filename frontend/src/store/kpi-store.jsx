import axios from "axios"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware";
const kpiStore = (set) => ({
    user: null,
    token: null,

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
    }
});
const usePersist ={
    name : 'kpi-store',
    storage : createJSONStorage(()=>localStorage)
}
const useKpiStore = create(persist(kpiStore,usePersist));

export default useKpiStore;

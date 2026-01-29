import { create } from 'zustand'
import { ImageSourcePropType } from 'react-native'

// 1. Define the vehicle shape (reuse this across your app)
export interface Vehicle {
  id: string;
  name: string;
  number: string;
  image: ImageSourcePropType;
}

// 2. Define the State & Actions interface
interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  
  addVehicle: (vehicle: Vehicle) => void;
  selectVehicle: (vehicle: Vehicle) => void;
  clearVehicles: () => void;
}

// 3. Create the store with the interface
export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: [],
  selectedVehicle: null,

  addVehicle: (vehicle) =>
    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
      selectedVehicle: vehicle, // auto select newly added
    })),

  selectVehicle: (vehicle) =>
    set(() => ({
      selectedVehicle: vehicle,
    })),

  clearVehicles: () =>
    set({
      vehicles: [],
      selectedVehicle: null,
    }),
}))
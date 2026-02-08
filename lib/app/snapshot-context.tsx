import { createContext, useContext } from "react";
import type { RootStoreSnapshot } from "./snapshot";

export const SnapshotContext = createContext<RootStoreSnapshot | undefined>(undefined);

export const useSnapshot = () => useContext(SnapshotContext);

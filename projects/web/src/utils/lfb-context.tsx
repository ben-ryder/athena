import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { LoadingScreen } from "../view/patterns/components/loading-screen/loading-screen";

export interface LFBContext {
  loading: boolean
}

export const LFBContext = createContext<LFBContext>({
  loading: true
});

export interface ApplicationProviderProps {
  children: ReactNode;
}

export function LFBProvider(props: ApplicationProviderProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <LFBContext.Provider
      value={{
        loading
      }}
    >
      {loading
        ? <LoadingScreen />
        : props.children}
    </LFBContext.Provider>
  );
}

export const useLFBApplication = () => useContext(LFBContext);

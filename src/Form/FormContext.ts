import * as React from "react";

export const FormContext = React.createContext<React.RefObject<HTMLFormElement>>({ current: null });

export function useFormContext() {
  return React.useContext(FormContext);
}

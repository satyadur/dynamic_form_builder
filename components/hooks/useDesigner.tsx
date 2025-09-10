"use client";

import React, { useContext } from "react";
import { DesignerContext } from "../context/DesignerContext";

function useDesigner() {
  const context = useContext(DesignerContext);
  if (!context) {
    throw new Error(
      "useDesigner context must be used within a DesignerContext"
    );
  }
  return context;
}

export default useDesigner;

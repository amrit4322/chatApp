import toast, { Toaster } from "react-hot-toast";
import React from "react";

const ToastComponent = ({ message, options }) => {
  const { background, icon } = options || {};

  // Display toast notification when the component mounts

  if (message) {
    toast.success(message, {
      style: {
        background: background || "lightgreen",
      },
      icon: icon || "👋",
    });
  }

  return <Toaster />;
};

export default ToastComponent;
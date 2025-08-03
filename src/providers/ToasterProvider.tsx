// src/providers/ToasterProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return <Toaster position="top-center" reverseOrder={false} />;
};

export default ToasterProvider;
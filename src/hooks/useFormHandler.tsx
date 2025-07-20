import { useState } from "react";

function useFormHandler(initialValues) {
    const [values, setValues] = useState(initialValues);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (key: string, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const resetForm = () => setValues(initialValues);

    return {
        values,
        errorMessage,
        isLoading,
        setErrorMessage,
        setIsLoading,
        handleChange,
        resetForm,
    };
}

export default useFormHandler;

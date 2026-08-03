import React from "react";
import clsx from "clsx";

const variants = {
    primary:
        "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
        "bg-gray-600 hover:bg-gray-700 text-white",

    success:
        "bg-green-600 hover:bg-green-700 text-white",

    danger:
        "bg-red-600 hover:bg-red-700 text-white",

    warning:
        "bg-yellow-500 hover:bg-yellow-600 text-white",

    outline:
        "border border-gray-300 hover:bg-gray-100 text-gray-700",

    ghost:
        "hover:bg-gray-100 text-gray-700"
};

export default function Button({

    children,

    type = "button",

    variant = "primary",

    className = "",

    disabled = false,

    loading = false,

    icon,

    ...props

}) {

    return (

        <button
            type={type}
            disabled={disabled || loading}
            className={clsx(

                "inline-flex items-center justify-center gap-2",

                "rounded-lg",

                "px-4 py-2",

                "font-medium",

                "transition",

                "duration-200",

                "disabled:opacity-50",

                "disabled:cursor-not-allowed",

                variants[variant],

                className

            )}

            {...props}
        >

            {loading ? (

                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />

            ) : (

                icon

            )}

            {children}

        </button>

    );

}
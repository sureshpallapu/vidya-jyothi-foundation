export default function Input({

    label,

    error,

    className = "",

    ...props

}) {

    return (

        <div className="space-y-1">

            {label && (

                <label className="block text-sm font-medium text-gray-700">

                    {label}

                </label>

            )}

            <input

                className={`
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-2.5
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-200
                    outline-none
                    ${className}
                `}

                {...props}

            />

            {error && (

                <p className="text-red-500 text-sm">

                    {error}

                </p>

            )}

        </div>

    );

}
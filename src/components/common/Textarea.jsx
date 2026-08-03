export default function Textarea({

    label,

    error,

    rows = 4,

    className = "",

    ...props

}) {

    return (

        <div className="space-y-1">

            {label && (

                <label className="block text-sm font-medium">

                    {label}

                </label>

            )}

            <textarea

                rows={rows}

                className={`
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-2.5
                    focus:ring-2
                    focus:ring-blue-200
                    outline-none
                    resize-none
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
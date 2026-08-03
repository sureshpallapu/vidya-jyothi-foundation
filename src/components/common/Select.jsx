export default function Select({

    label,

    options = [],

    error,

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

            <select

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
                    ${className}
                `}

                {...props}

            >

                {options.map(option => (

                    <option

                        key={option.value}

                        value={option.value}

                    >

                        {option.label}

                    </option>

                ))}

            </select>

            {error && (

                <p className="text-red-500 text-sm">

                    {error}

                </p>

            )}

        </div>

    );

}
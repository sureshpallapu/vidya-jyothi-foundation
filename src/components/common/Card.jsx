export default function Card({

    title,

    subtitle,

    children,

    actions

}) {

    return (

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">

            {(title || actions) && (

                <div className="flex justify-between items-center px-6 py-4 border-b">

                    <div>

                        <h2 className="text-lg font-semibold">

                            {title}

                        </h2>

                        {subtitle && (

                            <p className="text-sm text-gray-500">

                                {subtitle}

                            </p>

                        )}

                    </div>

                    {actions}

                </div>

            )}

            <div className="p-6">

                {children}

            </div>

        </div>

    );

}
import React from 'react';

const statsData = [
    { value: '1500+', label: 'Organization' },
    { value: '98.99%', label: 'AI success rate' },
    { value: '1500+', label: 'Total Call handle' },
];

export default function Stats() {
    return (
        <div className="flex flex-wrap gap-6 lg:gap-10 max-w-4xl mx-auto py-12">
            {statsData.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white flex-1 p-10 rounded-2xl shadow-md text-center"
                >
                    <p className="text-4xl lg:text-[32px] font-bold">
                        {stat.value}
                    </p>
                    <p className="text-gray-600 mt-2 font-light text-sm">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}

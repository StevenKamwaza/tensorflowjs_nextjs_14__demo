'use client'
import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid,
     Tooltip, ResponsiveContainer } from 'recharts';

const PredictionGraph = ({data}) => {
    return (
        <div>
            <div className='overflow-x-auto'>
                <ResponsiveContainer width="100%" height={270} className={"h-30vh"}>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="prediction" stroke="#8884d8" fill="#007bff" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}

export default PredictionGraph
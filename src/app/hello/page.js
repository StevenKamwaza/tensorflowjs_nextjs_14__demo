import React from 'react';
import * as tf from "@tensorflow/tfjs";
import { groupedData } from '@/utils/dummy';
import PredictionGraph from '@/components/predictionGraph';

const page = async () => {

    const startDate = new Date(groupedData[0].date);
    groupedData.forEach(d => {
        d.daysSinceStart = (new Date(d.date) - startDate) / (1000 * 60 * 60 * 24);
    });

    const xs = groupedData.map(d => d.daysSinceStart);

    const ys = groupedData.map(d => d.count);

    const model = tf.sequential();
    tf.disposeVariables();
    // model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.add(tf.layers.dense({ units: 100, inputShape: [1], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 100, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
   
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
    const xsTensor = tf.tensor2d(xs, [xs.length, 1]);
    const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

    //training
    await model.fit(xsTensor, ysTensor, { epochs: 150 });

    const futureDates = Array.from({ length: 30 }, (_, i) => xs[xs.length - 1] + i + 1);
    const futureDatesTensor = tf.tensor2d(futureDates, [futureDates.length, 1]);
    const predictionTensor = model.predict(futureDatesTensor);
    const predictionValues = predictionTensor.dataSync();
    // Create a new object with date for each prediction
    const futureDatesWithPredictions = futureDates.map((daysSinceStart, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + daysSinceStart);
        return {
            date: date.toISOString().split('T')[0], // format date as YYYY-MM-DD
            prediction: Math.round(predictionValues[i]),
        };
    });
    model.dispose();

    console.log(futureDatesWithPredictions)

    return (
        <div>
            {futureDatesWithPredictions && <PredictionGraph data={futureDatesWithPredictions} />}
        </div>
    )
}

export default page
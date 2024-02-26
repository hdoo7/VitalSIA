// Assuming shapeDict.js exports unityBlendshapes, unityBoneshapes, ActionUnitsList, EmotionsList, VisemesList
import { unityBlendshapes, unityBoneshapes, ActionUnitsList } from './shapeDict.js';
import fs from 'fs';

// Function to enrich target arrays and add missing records
function enrichAndAddMissing(targetArray, sourceArray) {
    // Remove 'index' from existing items and add 'description' from ActionUnitsList
    const enriched = targetArray.map(({ index, ...rest }) => {
        const match = sourceArray.find(au => au.id === rest.AUid);
        if (match) {
            return { ...rest, description: match.name };
        }
        return rest;
    });

    // Find and add missing Action Units
    const existingAUIDs = new Set(enriched.map(item => item.AUid));
    sourceArray.forEach(au => {
        if (!existingAUIDs.has(au.id)) {
            enriched.push({ AUid: au.id, description: au.name });
        }
    });

    return enriched;
}

// Enrich and update unityBlendshapes and unityBoneshapes
const processedUnityBlendshapes = enrichAndAddMissing(unityBlendshapes, ActionUnitsList);
const processedUnityBoneshapes = enrichAndAddMissing(unityBoneshapes, ActionUnitsList);

// Prepare data for writing
let dataToWrite = `
export const processedUnityBlendshapes = ${JSON.stringify(processedUnityBlendshapes, null, 4)};
export const processedUnityBoneshapes = ${JSON.stringify(processedUnityBoneshapes, null, 4)};
`;

// Write the enriched data to a JS file
fs.writeFile('processedData.js', dataToWrite, (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Data successfully written to processedData.js');
    }
});

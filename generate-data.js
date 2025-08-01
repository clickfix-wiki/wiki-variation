#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple YAML parser (same as in the HTML)
function parseYAML(yamlText) {
    const lines = yamlText.split('\n');
    const result = {};
    let currentKey = null;
    let currentArray = null;

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;

        // Check if this is a key-value pair
        if (line.includes(':') && !line.startsWith('-')) {
            const colonIndex = line.indexOf(':');
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            
            if (value === '') {
                // This is a key with no value (likely an array or object)
                currentKey = key;
                currentArray = null;
                result[key] = [];
            } else {
                // This is a simple key-value pair
                result[key] = value;
                currentKey = null;
                currentArray = null;
            }
        } else if (line.startsWith('-')) {
            // This is an array item
            const item = line.substring(1).trim();
            if (currentArray) {
                currentArray.push(item);
            } else if (currentKey) {
                result[currentKey].push(item);
            }
        }
    }

    return result;
}

// Generate JSON data from all YAML files
function generateData() {
    const techniquesDir = 'techniques';
    
    // Read all YAML files
    const files = fs.readdirSync(techniquesDir).filter(file => file.endsWith('.yaml'));
    
    console.log(`Generating data for ${files.length} techniques...`);
    
    const techniques = [];
    
    files.forEach(file => {
        const yamlPath = path.join(techniquesDir, file);
        const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        const technique = parseYAML(yamlContent);
        
        // Add the ID from the filename
        technique.id = file.replace('.yaml', '');
        
        techniques.push(technique);
    });
    
    // Write to JSON file
    fs.writeFileSync('data.json', JSON.stringify(techniques, null, 2));
    
    console.log('Data generated successfully!');
}

// Run the generator
generateData(); 
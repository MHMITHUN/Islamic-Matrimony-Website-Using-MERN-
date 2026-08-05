const pandoc = require('pandoc');
const fs = require('fs');

const inputFile = './SDP_Project_Proposal.md';
const outputFile = './SDP_Project_Proposal.docx';

pandoc.convertFile(inputFile, 'docx', [])
    .then(result => {
        fs.writeFileSync(outputFile, result);
        console.log('Done! File saved: SDP_Project_Proposal.docx');
    })
    .catch(err => {
        console.error('Error:', err.message);
        console.log('Trying alternative method...');
    });

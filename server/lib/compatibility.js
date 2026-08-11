// Deen (religious) compatibility sub-score in [0,1] and the overall weighted
// compatibility score. Shared by the member matching route and the guardian
// "browse on behalf of ward" route so the logic stays in one place.

function deenSubFactor(my, target) {
    let subscore = 0;
    let used = 0;

    if (my.sect && target.sect) {
        let s;
        if (my.sect === target.sect) s = 1.0;
        else if (my.sect.startsWith('Sunni') && target.sect.startsWith('Sunni')) s = 0.7;
        else if (my.sect === 'Shia' || target.sect === 'Shia') s = 0.2;
        else s = 0.5;
        subscore += s * 0.4; used += 0.4;
    }
    if (my.prayerFrequency && target.prayerFrequency) {
        const order = { 'Five Daily': 0, 'Sometimes': 1, 'Rarely': 2 };
        const diff = Math.abs((order[my.prayerFrequency] ?? 1) - (order[target.prayerFrequency] ?? 1));
        const p = diff === 0 ? 1.0 : diff === 1 ? 0.6 : 0.3;
        subscore += p * 0.25; used += 0.25;
    }
    if (my.religiousCommitment && target.religiousCommitment) {
        const order = { 'Practicing': 0, 'Moderate': 1, 'Cultural': 2 };
        const diff = Math.abs((order[my.religiousCommitment] ?? 1) - (order[target.religiousCommitment] ?? 1));
        const c = diff === 0 ? 1.0 : diff === 1 ? 0.7 : 0.3;
        subscore += c * 0.25; used += 0.25;
    }
    if (my.religiousEducation && target.religiousEducation) {
        const e = my.religiousEducation === target.religiousEducation ? 1.0 : 0.6;
        subscore += e * 0.1; used += 0.1;
    }

    return { score: used > 0 ? subscore / used : 0, used };
}

function calculateCompatibility(myBiodata, targetBiodata) {
    const WEIGHTS = { deen: 35, age: 25, height: 15, division: 15, occupation: 10 };
    let contribution = 0;
    let weightSum = 0;
    const details = { ageMatch: false, heightMatch: false, divisionMatch: false, occupationMatch: false, deenMatch: false };

    if (myBiodata.expectedPartnerAge && targetBiodata.age) {
        weightSum += WEIGHTS.age;
        const [minAge, maxAge] = String(myBiodata.expectedPartnerAge).split('-').map(Number);
        if (targetBiodata.age >= minAge && targetBiodata.age <= maxAge) {
            contribution += WEIGHTS.age;
            details.ageMatch = true;
        }
    }
    if (myBiodata.expectedPartnerHeight && targetBiodata.height) {
        weightSum += WEIGHTS.height;
        if (myBiodata.expectedPartnerHeight === targetBiodata.height) {
            contribution += WEIGHTS.height;
            details.heightMatch = true;
        }
    }
    if (myBiodata.permanentDivision && targetBiodata.permanentDivision) {
        weightSum += WEIGHTS.division;
        if (myBiodata.permanentDivision === targetBiodata.permanentDivision) {
            contribution += WEIGHTS.division;
            details.divisionMatch = true;
        }
    }
    if (myBiodata.occupation && targetBiodata.occupation) {
        weightSum += WEIGHTS.occupation;
        if (myBiodata.occupation === targetBiodata.occupation) {
            contribution += WEIGHTS.occupation;
            details.occupationMatch = true;
        }
    }

    const deen = deenSubFactor(myBiodata, targetBiodata);
    if (deen.used > 0) {
        weightSum += WEIGHTS.deen;
        contribution += WEIGHTS.deen * deen.score;
        details.deenMatch = deen.score >= 0.7;
    }

    return { score: weightSum > 0 ? Math.round((contribution / weightSum) * 100) : 0, details };
}

module.exports = { calculateCompatibility, deenSubFactor };

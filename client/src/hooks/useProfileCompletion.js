import { useMemo } from 'react';

const REQUIRED_FIELDS = [
    'biodataType', 'name', 'profileImage', 'dateOfBirth', 'height', 'weight',
    'occupation', 'race', 'fathersName', 'mothersName',
    'permanentDivision', 'presentDivision',
    'expectedPartnerAge', 'expectedPartnerHeight', 'expectedPartnerWeight',
    'mobileNumber'
];

export function useProfileCompletion(biodata) {
    return useMemo(() => {
        if (!biodata) return { percentage: 0, completed: 0, total: REQUIRED_FIELDS.length, missing: REQUIRED_FIELDS };

        const completed = REQUIRED_FIELDS.filter(field => {
            const value = biodata[field];
            return value !== null && value !== undefined && value !== '';
        });

        const missing = REQUIRED_FIELDS.filter(field => {
            const value = biodata[field];
            return value === null || value === undefined || value === '';
        });

        return {
            percentage: Math.round((completed.length / REQUIRED_FIELDS.length) * 100),
            completed: completed.length,
            total: REQUIRED_FIELDS.length,
            missing
        };
    }, [biodata]);
}

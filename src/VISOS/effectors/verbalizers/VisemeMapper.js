class VisemeMapper {
    mapPhonemesToVisemes(phonemes) {
        // Map phonemes to visemes
        const visemeMap = {
            'AA': 1, 'B': 2, 'K': 3, 'D': 4, 'EH': 5, 'F': 6, 'G': 7, 'HH': 8, 'IH': 9,
            'JH': 10, 'L': 11, 'M': 12, 'N': 13, 'AO': 14, 'P': 15, 'R': 16, 'S': 17, 'T': 18,
            'UH': 19, 'V': 20, 'W': 21, 'Y': 22, 'Z': 23
        };
        return phonemes.map(phoneme => visemeMap[phoneme] || 0);
    }
}

export default VisemeMapper;

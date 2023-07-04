import { getStatsByClassId, getMaleName, getFemaleName, getSurname } from "../../src/helpers";

// Test para getStatsByClassId
test('Test getStatsByClassId', () => {
    const stats = getStatsByClassId(1);
    // verifica que los stats obtenidos son correctos
    expect(stats.hp).toBeDefined();
    expect(stats.attack).toBeDefined();
    expect(stats.defence).toBeDefined();
});

// Test para getMaleName
test('Test getMaleName', () => {
    const name = getMaleName();
    // verifica que el nombre obtenido es una string
    expect(typeof name).toBe('string');
});

// Test para getFemaleName
test('Test getFemaleName', () => {
    const name = getFemaleName();
    // verifica que el nombre obtenido es una string
    expect(typeof name).toBe('string');
});

// Test para getSurname
test('Test getSurname', () => {
    const surname = getSurname();
    // verifica que el apellido obtenido es una string
    expect(typeof surname).toBe('string');
});
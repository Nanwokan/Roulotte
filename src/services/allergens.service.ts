export async function getAllAllergens() {
    // Implementation for getting all allergens
    // appel base de donnees
    // const allergens = await prisma.allergen.findMany();
    const allergens = [
        { id: 1, code: "Allergen 1", label: "Allergen 1 Label" },
        { id: 2, code: "Allergen 2", label: "Allergen 2 Label" },
        { id: 3, code: "Allergen 3", label: "Allergen 3 Label" },
    ];
    // tri par position
    return allergens.sort((a, b) => a.code.localeCompare(b.code));
}
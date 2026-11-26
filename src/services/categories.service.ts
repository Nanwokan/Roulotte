export async function getAllCategories() {
    // Implementation for getting all categories
    // appel base de donnees
    // const categories = await prisma.category.findMany();
    const categories = [
        { id: 1, name: "Category 1", position: 2 },
        { id: 2, name: "Category 2", position: 1 },
        { id: 3, name: "Category 3", position: 3 },
    ];
    // tri par position
    return categories.sort((a, b) => a.position - b.position);
}
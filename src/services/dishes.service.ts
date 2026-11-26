const dishes = [
        {"id" : 1, "name": "Le Classique", "description": "Bœuf, cheddar affiné, oignons confits, sauce maison", "priceCents": 1150, "category": "Burgers", "allergens": ["gluten", "lait", "oeufs", "moutarde", "sesame"], "available": true, "stock": null },
    { "id" : 2,"name": "Le Montagnard", "description": "Bœuf, raclette fondue, lard fumé, pommes grenaille", "priceCents": 1350, "category": "Burgers", "allergens": ["gluten", "lait", "moutarde"], "available": true, "stock": null },
    {"id" : 3, "name": "Le Poulet croustillant", "description": "Filet de poulet pané, salade, sauce yaourt-citron", "priceCents": 1250, "category": "Burgers", "allergens": ["gluten", "lait", "oeufs"], "available": true, "stock": null },
    {"id" : 4, "name": "Le Burger du mois", "description": "La recette surprise du chef (revient bientôt)", "priceCents": 1450, "category": "Burgers", "allergens": ["gluten", "lait"], "available": false, "stock": null },
    {"id" : 5, "name": "Wrap falafel", "description": "Falafels, houmous, crudités, sauce tahini", "priceCents": 1050, "category": "Veggie", "allergens": ["gluten", "sesame"], "available": true, "stock": null },
    {"id" : 6, "name": "Bowl quinoa-patate douce", "description": "Quinoa, patate douce rôtie, avocat, graines torréfiées", "priceCents": 1150, "category": "Veggie", "allergens": ["sesame"], "available": true, "stock": null },
    { "id" :7,"name": "Burger végé", "description": "Galette pois chiche-betterave, chèvre, roquette", "priceCents": 1200, "category": "Veggie", "allergens": ["gluten", "lait"], "available": true, "stock": null },
    {"id" : 8, "name": "Frites maison", "description": "Pommes de terre fraîches, double cuisson", "priceCents": 400, "category": "Accompagnements", "allergens": [], "available": true, "stock": null },
    {"id" : 9, "name": "Patates douces frites", "description": "Croustillantes, fleur de sel", "priceCents": 500, "category": "Accompagnements", "allergens": [], "available": true, "stock": null },
    {"id" : 10, "name": "Salade verte", "description": "Jeunes pousses, vinaigrette moutarde-miel", "priceCents": 350, "category": "Accompagnements", "allergens": ["moutarde"], "available": true, "stock": null },
    {"id" : 11, "name": "Cookie noisettes", "description": "Cuit sur place, cœur fondant", "priceCents": 300, "category": "Desserts", "allergens": ["gluten", "oeufs", "lait", "fruits-a-coque"], "available": true, "stock": 12 },
    { "id" : 12,"name": "Brownie", "description": "Chocolat noir et noix de pécan", "priceCents": 350, "category": "Desserts", "allergens": ["gluten", "oeufs", "lait", "fruits-a-coque"], "available": true, "stock": 8 },
    {"id" : 13, "name": "Salade de fruits frais", "description": "Fruits de saison, menthe fraîche", "priceCents": 400, "category": "Desserts", "allergens": [], "available": true, "stock": null },
    {"id" : 14, "name": "Citronnade maison", "description": "Citrons pressés, sucre de canne", "priceCents": 350, "category": "Boissons", "allergens": [], "available": true, "stock": null },
    {"id" : 15, "name": "Thé glacé pêche", "description": "Infusé à froid, peu sucré", "priceCents": 350, "category": "Boissons", "allergens": [], "available": true, "stock": null },
    {"id" : 16, "name": "Eau pétillante", "description": "50 cl", "priceCents": 250, "category": "Boissons", "allergens": [], "available": true, "stock": null },
    
    ];

// service
export async function getAllDishes({ categoryId, available, allergenFree = [] } = {}) {
  return dishes
    .filter(d => categoryId === undefined || d.categoryId === categoryId)
    .filter(d => available === undefined || d.available === available)
    .filter(d => !d.allergens.some(code => allergenFree.includes(code)))
    .sort((a, b) =>  a.name.localeCompare(b.name));
}
export async function getDishById(id) {
  return dishes.find(d => d.id === id) ?? null;
}
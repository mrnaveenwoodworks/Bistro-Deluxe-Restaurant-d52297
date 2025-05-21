const menuData = {
  starters: [
    {
      id: 1,
      name: "Truffle Arancini",
      description: "Crispy risotto balls infused with black truffle and stuffed with mozzarella cheese, served with truffle aioli.",
      price: 14.95,
      image: "https://images.unsplash.com/photo-1503503575729-1a27970ffe53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDcmlzcHklMkJnb2xkZW4lMkJ0cnVmZmxlJTJCYXJhbmNpbmklMkJiYWxscyUyQndpdGglMkJ0cnVmZmxlJTJCYWlvbGklMkJkaXBwaW5nJTJCc2F1Y2V8ZW58MHx8fHwxNzQ3ODM0MTU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true,
      dietary: ["vegetarian"],
      available: true,
      prepTime: 15,
      customization: {
        spiceLevel: ["mild", "medium", "spicy"],
        options: ["extra truffle aioli", "gluten-free breadcrumbs"]
      },
      allergens: ["dairy", "gluten", "eggs"],
      portionSize: "4 pieces"
    },
    {
      id: 2,
      name: "Tuna Tartare",
      description: "Fresh ahi tuna diced and tossed with avocado, cucumber, and citrus-soy dressing, served with wonton crisps.",
      price: 18.50,
      image: "https://images.unsplash.com/photo-1720305284322-07b6f099395c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxUdW5hJTJCdGFydGFyZSUyQndpdGglMkJhdm9jYWRvJTJCYW5kJTJCd29udG9uJTJCY3Jpc3BzfGVufDB8fHx8MTc0NzgzNDE1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      featured: false,
      dietary: ["gluten-free optional"],
      available: true,
      prepTime: 12,
      customization: {
        spiceLevel: ["mild", "medium", "spicy"],
        options: ["no onions", "extra avocado", "gluten-free crackers"]
      },
      allergens: ["fish", "soy", "gluten"],
      portionSize: "150g"
    }
  ],
  
  mainCourses: [
    {
      id: 3,
      name: "Filet Mignon",
      description: "8oz grass-fed beef tenderloin, served with truffle mashed potatoes, grilled asparagus, and red wine reduction.",
      price: 42.00,
      image: "https://images.unsplash.com/photo-1591726177513-478b79b1e8b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxGaWxldCUyQm1pZ25vbiUyQndpdGglMkJtYXNoZWQlMkJwb3RhdG9lcyUyQmFuZCUyQmFzcGFyYWd1c3xlbnwwfHx8fDE3NDc4MzQxNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true,
      dietary: ["gluten-free"],
      available: true,
      prepTime: 25,
      customization: {
        doneness: ["rare", "medium rare", "medium", "medium well", "well done"],
        sauces: ["red wine reduction", "béarnaise", "peppercorn"],
        sides: ["mashed potatoes", "roasted vegetables", "wild mushrooms"],
        options: ["extra sauce", "no garnish"]
      },
      allergens: ["dairy"],
      portionSize: "8oz/225g"
    },
    {
      id: 4,
      name: "Pan-Roasted Salmon",
      description: "Sustainably sourced salmon with forbidden black rice, baby bok choy, and miso-ginger glaze.",
      price: 34.95,
      image: "https://images.unsplash.com/photo-1650954316166-c3361fefcc87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxQYW4tcm9hc3RlZCUyQnNhbG1vbiUyQndpdGglMkJibGFjayUyQnJpY2UlMkJhbmQlMkJib2slMkJjaG95fGVufDB8fHx8MTc0NzgzNDE2NHww&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true,
      dietary: ["gluten-free", "dairy-free"],
      available: true,
      prepTime: 20,
      customization: {
        doneness: ["medium rare", "medium", "well done"],
        sauces: ["miso-ginger glaze", "citrus butter", "teriyaki"],
        sides: ["black rice", "quinoa", "cauliflower rice"],
        options: ["extra sauce", "no garnish", "extra vegetables"]
      },
      allergens: ["fish", "soy"],
      portionSize: "7oz/200g"
    }
  ],
  
  pasta: [
    {
      id: 5,
      name: "Lobster Linguine",
      description: "Fresh linguine pasta with chunks of Maine lobster, cherry tomatoes, and saffron cream sauce.",
      price: 32.95,
      image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxMb2JzdGVyJTJCbGluZ3VpbmUlMkJ3aXRoJTJCc2FmZnJvbiUyQmNyZWFtJTJCc2F1Y2V8ZW58MHx8fHwxNzQ3ODM0MTcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true,
      dietary: [],
      available: true,
      prepTime: 18,
      customization: {
        spiceLevel: ["mild", "medium", "spicy"],
        options: ["extra lobster", "light sauce", "gluten-free pasta", "whole wheat pasta"],
        additions: ["extra parmesan", "chili flakes", "fresh herbs"]
      },
      allergens: ["shellfish", "gluten", "dairy"],
      portionSize: "350g"
    }
  ],
  
  sides: [
    {
      id: 6,
      name: "Truffle Parmesan Fries",
      description: "Crispy fries tossed with truffle oil, grated Parmesan cheese, and fresh herbs.",
      price: 9.95,
      image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxUcnVmZmxlJTJCZnJpZXMlMkJ3aXRoJTJCcGFybWVzYW4lMkJhbmQlMkJoZXJic3xlbnwwfHx8fDE3NDc4MzQxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      featured: false,
      dietary: ["vegetarian"],
      available: true,
      prepTime: 10,
      customization: {
        options: ["extra truffle oil", "extra parmesan", "light seasoning"],
        spiceLevel: ["no spice", "mild", "spicy"]
      },
      allergens: ["dairy"],
      portionSize: "200g"
    }
  ],
  
  desserts: [
    {
      id: 7,
      name: "Dark Chocolate Soufflé",
      description: "Warm chocolate soufflé with a molten center, served with vanilla bean gelato (please allow 20 minutes).",
      price: 12.95,
      image: "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxEYXJrJTJCY2hvY29sYXRlJTJCc291ZmZsJTI1QzMlMjVBOSUyQndpdGglMkJ2YW5pbGxhJTJCZ2VsYXRvfGVufDB8fHx8MTc0NzgzNDE4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      featured: true,
      dietary: ["vegetarian"],
      available: true,
      prepTime: 20,
      customization: {
        options: ["extra chocolate sauce", "no gelato", "raspberry coulis"],
        temperature: ["warm", "hot"],
        additions: ["fresh berries", "whipped cream"]
      },
      allergens: ["dairy", "eggs", "gluten"],
      portionSize: "Individual soufflé"
    }
  ],
  
  beverages: [
    {
      id: 8,
      name: "Craft Cocktails",
      description: "Selection of handcrafted signature cocktails. Please ask your server for our current offerings.",
      price: "14.00 - 18.00",
      image: "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxTZWxlY3Rpb24lMkJvZiUyQnNpZ25hdHVyZSUyQmNvY2t0YWlsc3xlbnwwfHx8fDE3NDc4MzQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      featured: false,
      dietary: [],
      available: true,
      prepTime: 5,
      customization: {
        strength: ["regular", "strong", "light"],
        options: ["no garnish", "extra ice", "sugar-free"],
        additions: ["extra garnish", "premium spirit upgrade"]
      },
      allergens: [],
      portionSize: "250ml"
    },
    {
      id: 9,
      name: "Artisanal Coffee",
      description: "Locally roasted coffee beans prepared as espresso, cappuccino, or French press.",
      price: "4.50 - 6.75",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxDb2ZmZWUlMkJpbiUyQnZhcmlvdXMlMkJzZXJ2aW5nJTJCc3R5bGVzfGVufDB8fHx8MTc0NzgzNDE5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      featured: false,
      dietary: ["dairy-free options available"],
      available: true,
      prepTime: 5,
      customization: {
        milk: ["whole", "skim", "oat", "almond", "soy"],
        strength: ["regular", "strong", "light"],
        options: ["extra shot", "decaf", "iced"],
        additions: ["whipped cream", "flavored syrup", "cinnamon"]
      },
      allergens: ["dairy optional"],
      portionSize: "8oz/12oz/16oz"
    }
  ]
};

// Export menu categories for easy access
export const menuCategories = Object.keys(menuData);

// Helper function to get menu item by ID
export const getMenuItemById = (id) => {
  for (const category of menuCategories) {
    const item = menuData[category].find(item => item.id === id);
    if (item) return item;
  }
  return null;
};

// Helper function to get all available items
export const getAvailableItems = () => {
  const availableItems = {};
  menuCategories.forEach(category => {
    availableItems[category] = menuData[category].filter(item => item.available);
  });
  return availableItems;
};

// Helper function to get featured items
export const getFeaturedItems = () => {
  const featuredItems = [];
  menuCategories.forEach(category => {
    featuredItems.push(...menuData[category].filter(item => item.featured));
  });
  return featuredItems;
};

export default menuData;
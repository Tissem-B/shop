const express = require("express");
const cors = require("cors");
const admin = require("./firebase");
const db = admin.database();

const app = express();

// Configuration CORS
app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  methods: "GET,POST"
}));

app.use(express.json());

// Route existante
app.post("/message", (req, res) => {
  const { nom, type } = req.body;
  console.log("✅ Données reçues :", nom, type);
  res.json({ message: "Reçu", nom, type });
});

// Route pour les produits vendus
app.get("/products/sold/count", (req, res) => {
  db.ref("products").once("value")
    .then(snapshot => {
      const products = snapshot.val() || {};
      let soldCount = 0;

      Object.keys(products).forEach(key => {
        if (products[key].sold === true) soldCount++;
      });

      res.json({ 
        success: true,
        soldCount 
      });
    })
    .catch(error => {
      console.error("Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur"
      });
    });
});

// Nouvelle route pour le revenu
app.get("/products/revenue", (req, res) => {
  db.ref("products").once("value")
    .then(snapshot => {
      const products = snapshot.val() || {};
      let totalRevenue = 0;
      let soldCount = 0;

      Object.keys(products).forEach(key => {
        if (products[key].sold === true && products[key].price) {
          totalRevenue += parseFloat(products[key].price) || 0;
          soldCount++;
        }
      });

      res.json({
        success: true,
        totalRevenue,
        estimatedOrders: soldCount * 4500
      });
    })
    .catch(error => {
      console.error("Erreur:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur"
      });
    });
});

// Gestion des erreurs
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route non trouvée" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});



// Ajoutez cette route dans index.js
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API SmartFarm Shop",
    endpoints: {
      products_sold: "/products/sold/count",
      revenue: "/products/revenue",
      send_message: { 
        path: "/message",
        method: "POST",
        example_body: { nom: "string", type: "string" }
      }
    }
  });
});



// Route pour les produits visibles aux clients
app.get("/products/available", (req, res) => {
    db.ref("products").once("value")
      .then(snapshot => {
        const products = snapshot.val() || {};
        const availableProducts = [];
  
        for (const key in products) {
          if (products[key].stock > 0) { // Seulement les produits en stock
            availableProducts.push({
              id: key,
              name: products[key].name,
              price: products[key].price,
              image: products[key].image,
              description: products[key].shortDescription,
              stock: products[key].stock,
              category: products[key].category
            });
          }
        }
  
        res.json({
          success: true,
          products: availableProducts
        });
      })
      .catch(error => {
        console.error("Erreur:", error);
        res.status(500).json({
          success: false,
          error: "Erreur serveur"
        });
      });
  });
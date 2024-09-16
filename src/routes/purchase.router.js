import { Router } from "express";
import {auth} from '../middlewere/AuthMiddlewere.js'
import { PurchasesManager } from "../managers/PurchasesManager.js";


const router = Router()

const purchaseManager = new PurchasesManager()

// Ruta para finalizar la compra
router.get('/completePurchase',auth ,async (req, res) => {
    const userId = req.user.id; 
    const cartID = req.user.cart_id
    try {
      const result = await purchaseManager.finalizePurchase(userId,cartID); // Llamar al método para finalizar la compra
      res.status(200).json(result); // Enviar la respuesta al cliente
    } catch (error) {
      res.status(500).json({ status: 'error', msg: error.msg });
    }
  });

export default router
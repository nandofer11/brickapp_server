const {Router} = require('express');
const {whatsapp} = require('../libs/whatsappService');
const router = Router();

router.post('/enviarmensaje', async (req, res) => {
    const { telefono, mensaje } = req.body; // Recibir datos desde el cliente
    const chatId = telefono.substring(1) + "@c.us";

    try {
        const numberDetails = await whatsapp.getNumberId(chatId);
        if (numberDetails) {
            await whatsapp.sendMessage(chatId, mensaje); // Enviar mensaje dinámico
            res.json({ res: true, message: "Mensaje enviado correctamente" });
        } else {
            res.json({ res: false, message: "Número no válido" });
        }
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        res.status(500).json({ res: false, message: "Error en el servidor" });
    }
});


module.exports = router;
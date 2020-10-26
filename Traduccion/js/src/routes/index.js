const {Router} = require('express');
const router = Router();

router.get('/', (req, res)=> res.json({message: 'prueba de versiones'}));

module.exports = router;

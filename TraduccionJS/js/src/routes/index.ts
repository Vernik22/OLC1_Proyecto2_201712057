import { Router} from 'express';
import * as manejo from './manejoText';
import * as error from '../Analisis';

const router:Router = Router();

router.get('/tradJs', error.TradJs);

router.get('/Tokens', error.Ltokens);
router.get('/Esin', error.Lesint);
router.get('/Ctraducido', error.Ctraduc);

router.post('/b', (req,res)=>{

    res.send('Vernik GOD')
})

router.post('/recibir',manejo.Tsplit);
export default router;
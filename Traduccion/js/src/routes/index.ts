import { Router} from 'express';
import * as manejo from './manejoText';

const router:Router = Router();

router.get('/', (req,res)=>{
    res.send('HolaMundo desde Routes')
})

router.post('/b', (req,res)=>{

    res.send('Vernik GOD')
})

router.post('/recibir',manejo.Tsplit);
export default router;
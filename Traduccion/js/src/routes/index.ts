import { Router} from 'express';

const router:Router = Router();

router.get('/', (req,res)=>{
    res.send('HolaMundo desde Routes')
})

router.get('/vernik', (req,res)=>{
    res.send('Vernik GOD')
})

export default router;
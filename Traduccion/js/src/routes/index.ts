import { Router} from 'express';

const router:Router = Router();

router.get('/', (req,res)=>{
    res.send('HolaMundo desde Routes')
})

router.post('/b', (req,res)=>{

    res.send('Vernik GOD')
})

router.post('/recibir',function (req, res) {
 
    var edad = req.body.archivo;
    console.log(edad);
 
});
export default router;
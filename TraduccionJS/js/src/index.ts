import express from 'express';
//importing routs
import IndexRoutes from './routes'

const app = express();

app.set('port',5000 );

app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Rutas
app.use('/traduccion',IndexRoutes);



app.listen(app.get('port'), ()=> {
    console.log('Server on port 5000')
});
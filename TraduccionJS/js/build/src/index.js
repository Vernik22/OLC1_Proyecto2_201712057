"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//importing routs
const routes_1 = __importDefault(require("./routes"));
const app = express_1.default();
app.set('port', 5000);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//Rutas
app.use('/traduccion', routes_1.default);
app.listen(app.get('port'), () => {
    console.log('Server on port 5000');
});

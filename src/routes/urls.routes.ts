import { Router } from "express";
import Route from "../interfaces/routes.interface";
import UrlController from "../controllers/url.controller";
import authMiddleware from "../middlewares/auth.middleware";

class UrlRoute implements Route {
    public path = '/u';
    public router = Router();
    public urlController = new UrlController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/getAllUsers`, authMiddleware,this.urlController.getAllUrls);
        this.router.get(`${this.path}/:id`, this.urlController.getLongUrl);
        this.router.post(`${this.path}/createUrl`,authMiddleware, this.urlController.generateShortUrl);
    }
}

export default UrlRoute;
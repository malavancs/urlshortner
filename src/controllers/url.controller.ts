import UrlService from "../services/url.service";
import { NextFunction, Request, Response } from "express";
import { Url } from "../interfaces/url.interface";

class UrlController {
    public urlService = new UrlService();


    public getAllUrls = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req);
            const user = req.user;
            const getAllUsers: Url[] = await this.urlService.getUrlsByUser(user);
            res.status(200).json({ data: getAllUsers });
        } catch (error) {
            next(error);
        }
    }

    public getLongUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.params.id;
            const getLongUrl: string = await this.urlService.getLongUrl(query);
            res.redirect(getLongUrl);
        } catch (error) {
            next(error);
        }
    }

    public generateShortUrl = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const longUrl = req.body.longUrl;
            const user = req.user;
            console.log(user);
            const shortUrl = await this.urlService.generateShortUrl(longUrl,user);
            res.status(200).json({shortUrl});
        } catch(error){
            next(error);
        }
    }
}

export default UrlController;
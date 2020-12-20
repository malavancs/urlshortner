import DB from "../database";
import { Url } from "../interfaces/url.interface";

class UrlService {
    public urls = DB.Urls;

    public async getUrlsByUser(user: any): Promise<Url[]> {
        const allURL: Url[] = await this.urls.findAll(
            { where: { userId: user.id } });
        return allURL;
    }

    public async getLongUrl(shortUrl: string): Promise<any> {
        const longUrl = await this.urls.findOne({
            where: {
                shortUrl: shortUrl
            }
        });
        return longUrl.longUrl;
    }
    public async generateShortUrl(longUrl: string,user: any): Promise<any> {
        const url = await this.urls.create({
            longUrl: longUrl,
            clicks: 0,
            userId: user.id,
        });
        const id = url.id;
        const shortUrl = this.convertToBase62(`${id}`, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        url.shortUrl = `${shortUrl}`;
        await url.save();
        return url;
    }
    public convertToBase62(num, baseDigits) {
        let radix = 62;
        let keys = baseDigits.split('');
        if (!(radix >= 2 && radix <= keys.length)) throw new RangeError("toBase() radix argument must be between 2 and " + keys.length)

        if (num < 0) var isNegative = true
        if (isNaN(num = Math.abs(+num))) return NaN

        let output = [];
        do {
            let index = num % radix;
            output.unshift(keys[index]);
            num = Math.trunc(num / radix);
        } while (num != 0);
        if (isNegative) output.unshift('-')
        return output.join("");
    }
}
export default UrlService;
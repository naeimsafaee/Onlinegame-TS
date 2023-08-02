import Command from './Command';
import Http from '../../../Http'
import Coin from "../../Models/Coin";
import Site from "../../Models/Site";


class CounosCoin {
    id: number
    title: string
    keyword: string
    enabled: boolean = true

    constructor(args: { id: number, title: string, keyword: string, enabled: boolean }) {
        this.id = args.id
        this.title = args.title
        this.keyword = args.title
        this.enabled = args.enabled
    }

}

class UpdateCoins extends Command {

    async handle() {
        return;

        console.log("UpdateCoins is running...")

        const url = process.env.COUNOS_BASE_URL + "terminal/tickers";

        const sites = await Site.findAll({});

        for (let i = 0; i < sites.length; i++) {

            const api_key = (sites[i] as any).api_key as string
            const site_id = (sites[i] as any).id as string

            if (!api_key)
                continue;

            const all_coin_of_site = await Coin.findAll({
                where: {
                    site_id: site_id
                }
            });

            Http.get(url)
                .addHeaders({key: "accept", value: "application/json"})
                .addHeaders({key: "Content-Type", value: 'application/json'})
                .addHeaders({key: "x-api-key", value: api_key})
                .build()
                .getAsString(async (data: any) => {
                    data = JSON.parse(data).data

                    //check coin is supported?
                    for (let j = 0; j < all_coin_of_site.length; j++) {

                        let exists = false;

                        for (let k = 0; k < data.length; k++) {

                            if ((all_coin_of_site[j] as any).symbol === data[k].keyword) {
                                exists = true;
                            }
                        }
                        if (!exists) {
                            //have to remove this coin
                            await all_coin_of_site[j].update({
                                status: 'not supported'
                            })
                        }
                    }

                    //update ticker id
                    for (let j = 0; j < data.length; j++) {

                        const coin = await Coin.findOne({
                            where: {
                                site_id: site_id,
                                symbol: data[j].keyword
                            }
                        })

                        if (coin) {
                            await coin.update({
                                ticker_id: data[j].id,
                            })
                        } else {
                            await Coin.create({
                                site_id: site_id,
                                symbol: data[j].keyword,
                                name: data[j].title,
                                status: 'disabled',
                                ticker_id: data[j].id,
                            })
                        }

//

                    }

                })
                .getError((error) => {
                    console.log("Error : " + error)
                })
        }


    }

    get_interval_time() {
        return 10000 /*** 60  60*/;
    }


}


export default UpdateCoins
import { Controller, Get, Post, Body } from '@nestjs/common';
import { TronService } from './tron.service';
import { Param } from '@danieluhm2004/nestjs-tools';

@Controller('tron')
export class TronController {
    constructor(private readonly tronService: TronService) {

     console.log(
        this.getAllTrons("zkrxpdlf0808@gmail.com"));

    }

    @Get(":email")
    async getAllTrons(
        @Param('email') email: string
    ) {
        var wallet = this.tronService.createTronWalletFromEmail(email);
        var admount = await this.tronService.checkBalance(wallet.address);
        
        console.log(wallet);
        console.log(admount);
    }
}


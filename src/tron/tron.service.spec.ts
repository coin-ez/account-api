import { Test, TestingModule } from '@nestjs/testing';
import { TronService } from './tron.service';

describe('TronService', () => {
    let service: TronService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TronService],
        }).compile();

        service = module.get<TronService>(TronService);
    });

   let address;
    describe('createTronWalletFromEmail', () => {
        it('should create a Tron wallet from an email', () => {
            const email = 'test@example.com';
            const wallet = service.createTronWalletFromEmail(email);

            expect(wallet).toHaveProperty('address');

            address = wallet.address 
            expect(wallet).toHaveProperty('encryptedPrivateKey');
            expect(wallet).toHaveProperty('publicKey');
            expect(wallet).toHaveProperty('mnemonic');
        });
    });

    describe('checkBalance', () => {
        it('should return the balance of a Tron wallet', async () => {

            const balance = await service.checkBalance(address);

            console.log(balance);
            expect(balance).toBeGreaterThanOrEqual(0);
            expect(typeof balance).toBe('number');
        });
    });
});
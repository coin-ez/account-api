import { Injectable } from '@nestjs/common';
import TronWeb from "tronweb";
import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import { Mnemonic, ethers } from 'ethers';

function encryptPrivateKey(privateKey: string, secret: string): string {
    return CryptoJS.AES.encrypt(privateKey, secret).toString();
}

// 비공개 키 복호화 함수
function decryptPrivateKey(encryptedPrivateKey: string, secret: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// 이메일 기반 시드 생성 함수
function generateSeedFromEmail(email: string):any{
   const s=  bip39.mnemonicToSeedSync(email);

    console.log(s.length);
   return s; 
}

@Injectable()
export class TronService {
    private tronWeb: TronWeb;

    constructor() {
        // Initialize the TRON web instance
        this.tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            privateKey: 'e507864c1f3bae5e7811d2c0d2448d47703f07232e3af9dec58cd6697bcc9135',
        });
    }


    createTronWalletFromEmail(email: string): {
        address: string;
        encryptedPrivateKey: string;
        publicKey: string;
        mnemonic: string;
    } {

        // 이메일 기반 시드 생성


        const seed = generateSeedFromEmail(email);
        const mnemonic = bip39.entropyToMnemonic(seed.toString('hex').slice(0, 32));
    
        const wallet = ethers.HDNodeWallet.fromMnemonic(Mnemonic.fromPhrase(mnemonic));
        const privateKey = wallet.privateKey;
        const publicKey = wallet.publicKey;
    
    
        const secretKey = process.env.nimonicGenKey; // 비밀 키는 안전한 곳에 저장하세요
        const address = this.tronWeb.address.fromPrivateKey(privateKey.replace('0x', ''));
        console.log('New Tron Wallet Created:');
        console.log(`Address: ${address}`);
        console.log(`Public Key: ${publicKey}`);
        console.log(`Mnemonic: ${mnemonic}`);
        console.log(`Encrypted Private Key: ${privateKey}`);
    
        return { address : address, encryptedPrivateKey: privateKey, publicKey, mnemonic };

        // 니모닉에서 HD 지갑 생성
        // 주소 생성

        // 비공개 키 암호화// 비밀 키는 안전한 곳에 저장하세요


    }

    async checkBalance(address: string): Promise<number> {
        return await this.tronWeb.trx.getBalance(address);
    }
}
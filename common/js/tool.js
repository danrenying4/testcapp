import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';

// 后端提供的 RSA 公钥
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjl6/sMCRfzDTLpgNvCz59Sz01dMt1cec6wioBV2bmcfJ3cyteyilbPIw6vGmi4q8YfGCRbmfopJ/90dtrfOcHeg5NRQB6b//UjI7EMmlA+AjHH+cBL8LpWtojAB+cjI3eMArkjLFOhB9Vw+kdJQW/2tNsRosqIWmPxC06gtXvIwpvMYwHF6iQ1LX/3TFa1v9fCsc7HzH4fzvJ3qPTF1D+xOktA7Foirjy/Fcil0t+gpFvwTxxZK6TFKjkaJQQnkhMzY6YBbbhrWFyx6NooDVwl5hAsK4k7SMbUpdW0rV8MnSsBu/frZzcCY8plGP5ISQkcg7rPrDp+5CSpMmwobDOwIDAQAB
-----END PUBLIC KEY-----`;
// 生成随机 AES 密钥（32 字节，256 位）
function generateAesKey() {
	return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
}
// RSA 加密 AES 密钥
function encryptAesKey(aesKey) {
	const encryptor = new JSEncrypt();
	encryptor.setPublicKey(publicKey);
	return encryptor.encrypt(aesKey); // 返回 Base64 编码的加密结果
}
// AES 加密数据
function encryptData(data, aesKey) {
	const key = CryptoJS.enc.Base64.parse(aesKey);
	const iv = CryptoJS.lib.WordArray.random(16); // 随机 IV
	const encrypted = CryptoJS.AES.encrypt(data, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	// 返回 IV + 密文（Base64 编码）
	return CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
}

// 随机数6位
function generateSixDigitCode(length = 6) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}
	return result;
	return e
}

export default {
	publicKey,
	generateAesKey,
	encryptAesKey,
	encryptData,
	generateSixDigitCode
}
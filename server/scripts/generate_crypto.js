import forge from 'node-forge';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certsDir = path.join(__dirname, '..', 'certs');
if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
}

function generateCert(keys, subjectAttributes, issuerAttributes, isCA = false, caKey = null, caCert = null) {
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01' + forge.util.bytesToHex(forge.random.getBytesSync(19));
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);

    cert.setSubject(subjectAttributes);
    cert.setIssuer(issuerAttributes);

    const extensions = [{
        name: 'basicConstraints',
        cA: isCA
    }, {
        name: 'keyUsage',
        keyCertSign: isCA,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
    }, {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true
    }];

    cert.setExtensions(extensions);
    cert.sign(caKey || keys.privateKey, forge.md.sha256.create());

    return cert;
}

console.log('Generating CA KeyPair...');
const caKeys = forge.pki.rsa.generateKeyPair(2048);
const caAttrs = [{
    name: 'commonName',
    value: 'Haraka Internal Root CA'
}, {
    name: 'organizationName',
    value: 'Haraka'
}];
console.log('Generating CA Certificate...');
const caCert = generateCert(caKeys, caAttrs, caAttrs, true);

fs.writeFileSync(path.join(certsDir, 'ca.crt'), forge.pki.certificateToPem(caCert));
fs.writeFileSync(path.join(certsDir, 'ca.key'), forge.pki.privateKeyToPem(caKeys.privateKey));

console.log('Generating Vision Service KeyPair (mTLS)...');
const visionKeys = forge.pki.rsa.generateKeyPair(2048);
const visionAttrs = [{
    name: 'commonName',
    value: 'vision.haraka.internal'
}];
const visionCert = generateCert(visionKeys, visionAttrs, caAttrs, false, caKeys.privateKey, caCert);

fs.writeFileSync(path.join(certsDir, 'vision.crt'), forge.pki.certificateToPem(visionCert));
fs.writeFileSync(path.join(certsDir, 'vision.key'), forge.pki.privateKeyToPem(visionKeys.privateKey));

console.log('Generating Node.js Server KeyPair (mTLS)...');
const nodeKeys = forge.pki.rsa.generateKeyPair(2048);
const nodeAttrs = [{
    name: 'commonName',
    value: 'node.haraka.internal'
}];
const nodeCert = generateCert(nodeKeys, nodeAttrs, caAttrs, false, caKeys.privateKey, caCert);

fs.writeFileSync(path.join(certsDir, 'node.crt'), forge.pki.certificateToPem(nodeCert));
fs.writeFileSync(path.join(certsDir, 'node.key'), forge.pki.privateKeyToPem(nodeKeys.privateKey));

console.log('Generating Vision RSA Payload Signing KeyPair...');
const rsaKeys = forge.pki.rsa.generateKeyPair(2048);
fs.writeFileSync(path.join(certsDir, 'vision_private.pem'), forge.pki.privateKeyToPem(rsaKeys.privateKey));
fs.writeFileSync(path.join(certsDir, 'vision_public.pem'), forge.pki.publicKeyToPem(rsaKeys.publicKey));

console.log('✅ All Cryptographic Assets Generated Successfully in /certs directory.');

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletComponent = () => {
    const [wallet, setWallet] = useState(null);
    const [mnemonic, setMnemonic] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);

    useEffect(() => {
        // Load wallet from localStorage on component mount
        loadWallet();
    }, []);

    const generateWallet = async () => {
        try {
            const newWallet = ethers.Wallet.createRandom();
            const newMnemonic = newWallet.mnemonic.phrase;
            const newPrivateKey = newWallet.privateKey;

            localStorage.setItem('wallet', newMnemonic);
            setWallet(newWallet);
            setMnemonic(newMnemonic);
            setPrivateKey(newPrivateKey);
        } catch (error) {
            console.error('Error generating wallet:', error);
        }
    };

    const loadWallet = () => {
        try {
            const mnemonicFromStore = localStorage.getItem('wallet');
            if (mnemonicFromStore) {
                const loadedWallet = ethers.Wallet.fromMnemonic(mnemonicFromStore);
                const loadedPrivateKey = loadedWallet.privateKey;

                setWallet(loadedWallet);
                setMnemonic(mnemonicFromStore);
                setPrivateKey(loadedPrivateKey);
            }
        } catch (error) {
            console.error('Error loading wallet:', error);
        }
    };

    const connectToPolygon = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/850ea6ca89d845c589b52e9d8b9af0c8');
            const connectedWallet = wallet.connect(provider);
            setWallet(connectedWallet);

        } catch (error) {
            console.error('Error connecting to Polygon:', error);
        }
    };

    return (
        <div style={styles.container}>
            <p style={styles.label}>Mnemonic:</p>
            <p style={styles.mnemonicText}>{mnemonic}</p>
            <p style={styles.label}>Wallet Address:</p>
            <p style={styles.addressText}>{wallet ? wallet.address : 'No wallet generated'}</p>
            <p style={styles.label}>Private Key:</p>
            <p style={styles.privateKeyText}>{privateKey}</p>

            {wallet ? (
                <>
                    <button onClick={connectToPolygon}>Connect to Polygon</button>
                </>
            ) : (
                <button onClick={generateWallet}>Generate Wallet</button>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    label: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    mnemonicText: {
        fontSize: '16px',
        marginBottom: '20px',
    },
    addressText: {
        fontSize: '16px',
        marginBottom: '20px',
    },
    privateKeyText: {
        fontSize: '16px',
        marginBottom: '30px',
        wordBreak: 'break-all',
    },
};

export default WalletComponent;

// Frontend code using ethers.js and React
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const DeSciPlatform = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [researcher, setResearcher] = useState(null);
    const [publications, setPublications] = useState([]);
    
    // Contract ABI would be imported from deployment
    const contractAddress = "YOUR_CONTRACT_ADDRESS";
    
    useEffect(() => {
        const init = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, ABI, signer);
                
                setContract(contract);
                
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                setAccount(accounts[0]);
                
                // Load researcher details
                const researcher = await contract.getResearcherDetails(accounts[0]);
                setResearcher(researcher);
            }
        };
        
        init();
    }, []);
    
    const registerResearcher = async (name, credentials) => {
        try {
            const tx = await contract.registerResearcher(name, credentials);
            await tx.wait();
            // Refresh researcher details
            const researcher = await contract.getResearcherDetails(account);
            setResearcher(researcher);
        } catch (error) {
            console.error("Error registering:", error);
        }
    };
    
    const submitPublication = async (title, contentHash) => {
        try {
            const tx = await contract.submitPublication(title, contentHash);
            await tx.wait();
            // Refresh publications
            // Implementation depends on how you're storing/retrieving publications
        } catch (error) {
            console.error("Error submitting publication:", error);
        }
    };
    
    return (
        <div className="container mx-auto px-4">
            <header className="py-6">
                <h1 className="text-3xl font-bold">DeSci Platform</h1>
                <p className="text-gray-600">
                    Connected Account: {account ? account : 'Not connected'}
                </p>
            </header>
            
            {!researcher && (
                <div className="my-8">
                    <h2 className="text-xl font-bold mb-4">Register as Researcher</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        registerResearcher(
                            e.target.name.value,
                            e.target.credentials.value
                        );
                    }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="border p-2 mr-2"
                        />
                        <input
                            type="text"
                            name="credentials"
                            placeholder="Credentials"
                            className="border p-2 mr-2"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Register
                        </button>
                    </form>
                </div>
            )}
            
            {researcher && (
                <div className="my-8">
                    <h2 className="text-xl font-bold mb-4">Submit Publication</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        submitPublication(
                            e.target.title.value,
                            e.target.contentHash.value
                        );
                    }}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Publication Title"
                            className="border p-2 mr-2"
                        />
                        <input
                            type="text"
                            name="contentHash"
                            placeholder="Content Hash (IPFS)"
                            className="border p-2 mr-2"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}
            
            {/* Publications List */}
            <div className="my-8">
                <h2 className="text-xl font-bold mb-4">Recent Publications</h2>
                <div className="grid gap-4">
                    {publications.map((pub) => (
                        <div key={pub.id} className="border p-4 rounded">
                            <h3 className="font-bold">{pub.title}</h3>
                            <p className="text-gray-600">
                                By: {pub.author}
                            </p>
                            <p>
                                Upvotes: {pub.upvotes}
                            </p>
                            <button
                                onClick={() => contract.upvotePublication(pub.id)}
                                className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                            >
                                Upvote
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DeSciPlatform;
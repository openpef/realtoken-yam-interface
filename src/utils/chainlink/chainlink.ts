
// Map token to their oracle price feed contract
export const chainLink: Map<string,string> = new Map<string,string>([
    //GNOSIS
    ["0xe91d153e0b41518a2ce8dd3d7944fa863463a97d","0x678df3415fc31947dA4324eC63212874be5a82f8"], //WXDAI
    ["0x0ca4f5554dd9da6217d62d8df2816c82bba4157b","0x678df3415fc31947dA4324eC63212874be5a82f8"], //rmmv3XDAI
    ["0xddafbb505ad214d7b80b1f830fccc89b60fb7a83","0x26C31ac71010aF62E6B486D1132E266D6298857D"], //USDC
    ["0xed56f76e9cbc6a64b821e9c016eafbd3db5436d1","0x26C31ac71010aF62E6B486D1132E266D6298857D"], //rmmv3USDC
    // ETH
    ["0x5f98805a4e8be255a32880fdec7f6728c6568ba0","0x3D7aE7E594f2f2091Ad8798313450130d0Aba3a0"], //LUSD
    ["0x6b175474e89094c44da98b954eedeac495271d0f","0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9"], //DAI
    ["0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48","0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6"], //USDC
    ["0xdac17f958d2ee523a2206206994597c13d831ec7","0x3E7d1eAB13ad0104d2750B8863b489D65364e32D"], //TUSD
    // GOERLI
    ["0x292c5840efe7c3282ad2eb88a53cdbf2841f0917","0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"], // WETH
    ["0x3e7493506bc350ed7f5344196b1842185753bde1","0x0d79df66BE487753B02D015Fb622DED7f0E9798d"], // USDC
    ["0x803029db36f37d130d8a005a62c55d17383f6f15","0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7"] // DAI
]);